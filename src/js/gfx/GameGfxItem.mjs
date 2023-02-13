import GameItem from '../core/GameItem.mjs';
import { Object3D } from 'three';

export default class GameGfxItem {

    /**
     * @type {GameItem}
     */
    gameItem = null;
    /**
     * @type {Object3D}
     */
    gfxObject = null;

    static impl = null;

    static async configure() {
        GameGfxItem.impl = (await import('./CycleBubble.mjs')).default;
    }

    static createInstance(gameItem) {
        return new GameGfxItem.impl(gameItem);
    }

    /**
     * @param {GameItem} gameItem
     */
    createNewFrom(gameItem) {
        throw new Error("Not implemented");
    }

    animate(dt, time) {
        throw new Error("Not implemented");
    }

    /**
     * @param {GameGfxItem[]} gfxItems 
     * @returns {GameGfxItem}
     */
    findCollidedItem(gfxItems) {
        return gfxItems
                .filter(gfxItem => gfxItem !== this)
                .find(gfxItem => {
                    let minDist = this.gfxObject.scale.x + gfxItem.gfxObject.scale.x;
                    return this.gfxObject.position.distanceToSquared(gfxItem.gfxObject.position) < minDist*minDist;
        });
    }
}