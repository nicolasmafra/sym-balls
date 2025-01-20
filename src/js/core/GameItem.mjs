import Permutation from './Permutation.mjs'

export default class GameItem {

    static #idCounter = 0;

    #id = 0;
    permutation = [];
    locked = false;
    limited = false;

    constructor(permutation, locked, limited) {
        this.#id = GameItem.#getNewId();
        this.permutation = [...permutation];
        this.locked = locked || false;
        this.limited = limited || false;
    }

    static #getNewId() {
        return this.#idCounter++;
    }

    getId() {
        return this.#id;
    }

    getPermutation() {
        return [...this.permutation];
    }

    isLocked() {
        return this.locked;
    }

    isLimited() {
        return this.limited;
    }

    /**
     * @returns {GameItem}
     */
    clone() {
        return new GameItem(this.permutation, this.locked);
    }

    /**
     * @returns {GameItem}
     */
    unlock() {
        return new GameItem(this.permutation, false);
    }

    /**
     * @returns {GameItem}
     */
    inverse() {
        return new GameItem(Permutation.invertArray(this.permutation), this.locked);
    }

    isIdentity() {
        return Permutation.isIdentityArray(this.permutation);
    }

    /**
     * @param {GameItem} anotherItem 
     * @returns {GameItem}
     */
    mergeWith(anotherItem) {
        let permutation = Permutation.compose(this.permutation, anotherItem.permutation);
        let locked = this.locked || anotherItem.locked;
        return new GameItem(permutation, locked);
    }

    toString() {
        return JSON.stringify({
            id: this.getId(),
            permutation: this.getPermutation(),
            locked: this.isLocked()
        });
    }
}