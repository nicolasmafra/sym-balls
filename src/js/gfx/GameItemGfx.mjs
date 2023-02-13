import GameItem from '../core/GameItem.mjs';
import { Object3D } from 'three';

export default class GameItemGfx {

    gameItem = null;
    gfxObject = null;

    /**
     * @param {GameItem} gameItem
     * @param {Object3D} gfxObject
     */
    constructor(gameItem, gfxObject) {
        this.gameItem = gameItem;
        this.gfxObject = gfxObject;
    }

    /**
     * @returns {GameItem}
     */
    getGameItem() {
        return this.gameItem;
    }

    animate(dt, time) {
        PermutationBubble.animateBubble(this.gfxObject, dt, time);
    }

    findCollidedItem(items) {
        return items
                .filter(item => item != this)
                .find(item => {
                    let minDist = this.gfxObject.scale.x + item.gfxObject.scale.x;
                    return this.gfxObject.position.distanceToSquared(item.gfxObject.position) < minDist*minDist;
        });
    }

    mergeWith(item) {
        let resultPermutation = Permutation.compose(this.permutation, item.permutation);
        return GameItemGfx.createFromPermutation(resultPermutation);
    }
}