import GameItem from './GameItem.mjs'

const STORAGE_NAME = 'game-progress';

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

    moves = 0;
    winningResult = null;

    constructor(schema) {
        this.schema = schema;
        this.reset();
    }

    reset() {
        this.winningResult = null;
        this.moves = 0;
        if (this.schema.initialItems) {
            this.items = this.schema.initialItems
                .map(schemaItem => new GameItem(schemaItem, this.schema.lockInitialItems, false));
        }
        if (this.schema.generatingSet) {
            this.dockItems = this.schema.generatingSet
                .map(schemaItem => new GameItem(schemaItem, false, this.schema.finiteDock));
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

    #removeItemWithId(itemList, itemId) {
        let index =  itemList.findIndex(item => item.getId() === itemId);
        if (index < 0) {
            throw new Error("Not found item with id=" + itemId);
        }
        itemList.splice(index, 1);
      }

    #assertNotLockedItem(item) {
        if (item.isLocked()) {
            throw new Error("Item is locked");
        }
    }

    /**
     * @param {number} itemId 
     * @returns {GameItem}
     */
    #findNotLockedItemWithId(itemId) {
        let item = this.#findItemWithId(this.items, itemId);
        this.#assertNotLockedItem(item);
        return item;
    }

    #removeItem(item) {
        this.items = this.items.filter(i => i !== item);
    }

    #addItem(item) {
        this.items.unshift(item);
        return item;
    }

    isOnDock(itemId) {
        return this.dockItems.find(item => item.getId() === itemId) !== undefined;
    }

    deleteItem(itemId) {
        if (!this.schema.allowedDeletion) {
            throw new Error("Deletion is not allowed.");
        }
        let item = this.#findNotLockedItemWithId(itemId);

        this.#removeItem(item);
        this.moves++;
        this.#checkWinning();
    }

    /**
     * @returns {GameItem}
     */
    duplicateItem(itemId) {
        if (!this.schema.allowedDuplication) {
            throw new Error("Duplication is not allowed.");
        }
        let item = this.#findNotLockedItemWithId(itemId);

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
        let item = this.#findNotLockedItemWithId(itemId);

        this.#removeItem(item);
        let inverse = item.inverse();
        return this.#addItem(inverse);
    }

    /**
     * @returns {GameItem}
     */
    mergeItem(itemId1, itemId2) {
        let item1 = this.#findNotLockedItemWithId(itemId1);
        let item2 = this.#findItemWithId(this.items, itemId2);

        this.#removeItem(item1);
        this.#removeItem(item2);
        let resultItem = item1.mergeWith(item2);
        if (resultItem.isIdentity()) {
            resultItem = undefined;
        } else {
            this.#addItem(resultItem);
        }
        this.moves++;
        this.#checkWinning();
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

    tryRemoveItemFromDock(dockItemId) {
        if (this.schema.finiteDock) {
            this.#removeItemWithId(this.dockItems, dockItemId);
            return true;
        }
        return false;
    }

    #checkWinning() {
        this.#checkWinningResult();
        if (this.winningResult && this.schema.id) {
            let progress = JSON.parse(localStorage.getItem(STORAGE_NAME)) || {};

            let stars = 1;
            if (this.moves <= this.schema.expectedMoves) {
                stars = 2;
            }
            if (this.moves <= this.schema.targetMoves) {
                stars = 3;
            }

            if (stars > (progress[this.schema.id] || 0)) {
                progress[this.schema.id] = stars;
                localStorage.setItem(STORAGE_NAME, JSON.stringify(progress));
            }
        }
        return this.winningResult;
    }

    #checkWinningResult() {
        if (this.winningResult !== null) {
            return this.winningResult;
        }
        if (this.schema.infinite) {
            return null;
        }
        if (this.items.length == 0) {
            return this.winningResult = true;
        }
        if (this.items.length == 1) {
            let lastItem = this.items[0];
            if (lastItem.isIdentity()) {
                return this.winningResult = true;
            }
            if (this.dockItems.length > 0) {
                return this.winningResult;
            }
            if (!lastItem.isIdentity()) {
                return this.winningResult = false;
            }
        }
        let lockedItems = this.items.filter(item => item.locked);
        let nonLockedItems = this.items.filter(item => !item.locked);
        if (lockedItems.length > 0 && nonLockedItems.length === 0 && this.dockItems.length === 0) {
            return this.winningResult = false;
        }
        return this.winningResult;
    }
}