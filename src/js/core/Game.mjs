import GameItem from './GameItem.mjs'

export default class Game {

    schema = null;
    /**
     * @type {GameItem[]}
     */
    items = [];
    /**
     * @type {GameItem[]}
     */
    dockItems = [];

    winningResult = null;

    constructor(schema) {
        this.schema = schema;
        this.reset();
    }

    reset() {
        this.winningResult = null;
        if (this.schema.initialItems) {
            this.items = this.schema.initialItems
                .map(schemaItem => new GameItem(schemaItem, this.schema.lockInitialItems));
        }
        if (this.schema.generatingSet) {
            this.dockItems = this.schema.generatingSet
                .map(schemaItem => new GameItem(schemaItem, false));
        }
    }

    /**
     * @returns {GameItem[]}
     */
    getItems() {
        return this.items;
    }

    /**
     * @returns {GameItem[]}
     */
    getDockItems() {
        return this.dockItems;
    }

    /**
     * @returns {boolean} or null if not finished
     */
    getWinningResult() {
        return this.winningResult;
    }

    #findItemWithId(itemList, itemId) {
        let item =  itemList.find(item => item.getId() === itemId);
        if (item === undefined) {
            throw new Error("Not found item with id=" + itemId);
        }
        return item;
    }

    #assertNotLockedItem(item) {
        if (item.isLocked()) {
            throw new Error("Item is locked");
        }
    }

    #findNotLockedItemWithId(itemList, itemId) {
        let item = this.#findItemWithId(this.items, itemId);
        this.#assertNotLockedItem(item);
        return item;
    }

    #removeItem(item) {
        this.items = this.items.filter(i => i !== item);
    }

    #addItem(item) {
        this.items.push(item);
        return item;
    }

    deleteItem(itemId) {
        if (!this.schema.allowedDeletion) {
            throw new Error("Deletion is not allowed.");
        }
        let item = this.#findNotLockedItemWithId(this.items, itemId);

        this.#removeItem(item);
        this.#checkWinningResult();
    }

    /**
     * @returns {GameItem}
     */
    duplicateItem(itemId) {
        if (!this.schema.allowedDuplication) {
            throw new Error("Duplication is not allowed.");
        }
        let item = this.#findNotLockedItemWithId(this.items, itemId);

        let clone = item.clone();
        return this.#addItem(clone);
    }

    /**
     * @returns {GameItem}
     */
    invertItem(itemId) {
        if (!this.schema.allowedInversion) {
            throw new Error("Inversion is not allowed.");
        }
        let item = this.#findNotLockedItemWithId(this.items, itemId);

        this.#removeItem(item);
        let inverse = item.inverse();
        return this.#addItem(inverse);
    }

    /**
     * @returns {GameItem}
     */
    mergeItem(itemId1, itemId2) {
        let item1 = this.#findNotLockedItemWithId(this.items, itemId1);
        let item2 = this.#findItemWithId(this.items, itemId2);

        this.#removeItem(item1);
        this.#removeItem(item2);
        let resultItem = item1.mergeWith(item2);
        this.#addItem(resultItem);
        this.#checkWinningResult();
        return resultItem;
    }

    /**
     * @returns {GameItem}
     */
    addItemFromDock(dockItemId) {
        let dockItem = this.#findItemWithId(this.dockItems, dockItemId);
        let item = dockItem.clone();
        return this.#addItem(item);
    }

    #checkWinningResult() {
        if (this.winningResult !== null) {
            return this.winningResult;
        }
        if (this.dockItems.length > 0) {
            return null;
        }
        if (this.items.length == 0) {
            return this.winningResult = true;
        }
        if (this.items.length == 1) {
            let lastItem = this.items[0];
            return this.winningResult = lastItem.isIdentity();
        }
        return this.winningResult;
    }
}