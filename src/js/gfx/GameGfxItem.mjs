import GameItem from '../core/GameItem.mjs';
import { Object3D, Vector3 } from 'three';
import Params from '../Params.mjs';
import BubbleUtils from './BubbleUtils.mjs';

const oscillationSpeed = 1.0 * Math.PI;
const oscillationAmplitudeRatio = 0.01;

export default class GameGfxItem {

    /**
     * @type {GameItem}
     */
    gameItem = null;
    /**
     * @type {boolean}
     */
    isOnDock = false;
    /**
     * @type {Object3D}
     */
    gfxObject = null;
    /**
     * @type {Vector3}
     */
    originalPosition = null;
    originalScale = null;

    static implMapping = null;

    static async configure() {
        GameGfxItem.impl = {};
        GameGfxItem.impl['cycle'] = (await import('./CycleBubble.mjs')).default;
        GameGfxItem.impl['mapping'] = (await import('./MappingBubble.mjs')).default;
    }

    /**
     * @param {GameItem} gameItem 
     * @returns {GameGfxItem}
     */
    static createInstance(gameItem) {
        let impl = GameGfxItem.impl[Params.value.itemType];
        const instance =  new impl(gameItem);
        instance.gfxObject.scale.multiplyScalar(Params.getItemSize());
        return instance;
    }

    /**
     * @param {GameGfxItem} gameItem 
     */
    static configNewObject(gfxItem) {
        gfxItem.gfxObject.userData = gfxItem;

        if (gfxItem.gameItem.isLocked()) {
            BubbleUtils.addLockedOutline(gfxItem.gfxObject);
        }
        if (gfxItem.gameItem.isLimited()) {
            BubbleUtils.addLimitedOutline(gfxItem.gfxObject);
        }
    }

    setPosition(position) {
        this.originalPosition = position;
        this.resetPosition();
    }

    resetPosition() {
        this.gfxObject.position.copy(this.originalPosition);
    }

    fixPosition() {
        this.originalPosition = this.gfxObject.position.clone();
    }

    animate(dt, time) {
        if (Params.value.itemOscillation) {
            this.oscilateGroupSize(time);
        }
    }

    oscilateGroupSize(time) {
        if (!this.originalScale) {
            this.originalScale = this.gfxObject.scale.x;
        }
        let cos = Math.cos(time * oscillationSpeed);
        this.gfxObject.scale.setScalar(this.originalScale * (1 + oscillationAmplitudeRatio * cos));
    }

    /**
     * @param {GameGfxItem[]} gfxItems 
     * @returns {GameGfxItem}
     */
    findCollidedItem(gfxItems) {
        return gfxItems
                .filter(gfxItem => gfxItem !== this)
                .map(gfxItem => ({
                    gfxItem,
                    distSquared: this.gfxObject.position.distanceToSquared(gfxItem.gfxObject.position)
                }))
                .filter(obj => {
                    let minDist = this.gfxObject.scale.x + obj.gfxItem.gfxObject.scale.x;
                    return obj.distSquared < minDist*minDist;
                })
                .sort((a,b) => a.distSquared - b.distSquared)
                .map(obj => obj.gfxItem)[0];
    }
}