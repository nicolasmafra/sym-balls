import GameItem from './GameItem.mjs'

export default class Game {

    schema = null;
    items = [];
    dockItems = [];

    constructor(schema) {
        this.schema = schema;
        if (schema.initialItems) {
            this.items = schema.initialItems
                .map(schemaItem => new GameItem(schemaItem, schema.lockInitialItems));
        }
        if (schema.generatingSet) {
            this.dockItems = schema.generatingSet
                .map(schemaItem => new GameItem(schemaItem, false));
        }
    }

    getItems() {
        return this.items;
    }

    getDockItems() {
        return this.dockItems;
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
    }

    duplicateItem(itemId) {
        if (!this.schema.allowedDuplication) {
            throw new Error("Duplication is not allowed.");
        }
        let item = this.#findNotLockedItemWithId(this.items, itemId);

        let clone = item.clone();
        return this.#addItem(clone);
    }

    invertItem(itemId) {
        if (!this.schema.allowedInversion) {
            throw new Error("Inversion is not allowed.");
        }
        let item = this.#findNotLockedItemWithId(this.items, itemId);

        this.#removeItem(item);
        let inverse = item.inverse();
        return this.#addItem(inverse);
    }

    mergeItem(itemId1, itemId2) {
        let item1 = this.#findNotLockedItemWithId(this.items, itemId1);
        let item2 = this.#findItemWithId(this.items, itemId2);

        this.#removeItem(item1);
        this.#removeItem(item2);
        let resultItem = item1.mergeWith(item2);
        return this.#addItem(resultItem);
    }

    addItemFromDock(dockItemId) {
        let dockItem = this.#findItemWithId(this.dockItems, dockItemId);
        let item = dockItem.clone();
        return this.#addItem(item);
    }
}