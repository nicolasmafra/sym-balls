import GameGfxItem from './GameGfxItem.mjs';
import GameItem from '../core/GameItem.mjs';
import Cycle from '../core/Cycle.mjs';
import Params from '../Params.mjs';
import * as THREE from 'three';
import BubbleUtils from './BubbleUtils.mjs';

const ballGeometry = new THREE.SphereGeometry(1, 16, 8);

const cycleMargin = 0.5;
const bubbleRotationSpeed = 0.25;
const cycleGroupRotationSpeed = 1.5;
const cycleXRotationSpeed = 0.5;

let CycleBubbleBuilder = {

    indexToBall(i) {
        return BubbleUtils.indexToMesh(i, ballGeometry);
    },

    cycleToGroup(cycle) {

        let balls = cycle.map(index => this.indexToBall(index));

        return BubbleUtils.createCircleGroup(balls, 1, cycleMargin);
    },

    build(cycles) {

        let subGroups = cycles.map(cycle => this.cycleToGroup(cycle));

        return BubbleUtils.makeBubble(subGroups);
    },
};

export default class CycleBubble extends GameGfxItem {

    cycles = [];

    /**
     * @param {GameItem} gameItem 
     */
    constructor(gameItem) {
        super();
        this.gameItem = gameItem;
        this.cycles = Cycle.arrayToCycles(gameItem.getPermutation());
        this.cycles = Cycle.normalizeCycles(this.cycles);
        this.gfxObject = CycleBubbleBuilder.build(this.cycles);
        this.gfxObject.userData = this;
    }

    createNewFrom(gameItem) {
        return new CycleBubble(gameItem);
    }

    animate(dt, time) {
        super.animate(dt, time);

        if (Params.value.rotateMode !== 'DISABLED') {
            this.#rotate(time);
        }
    }

    #rotate(time) {
        if (Params.value.rotateMode === '3D') {
            this.gfxObject.children[0].rotation.x = time * bubbleRotationSpeed;
        }
        this.gfxObject.children[0].rotation.z = time * bubbleRotationSpeed;

        let cycleGroups = this.gfxObject.children[0].children;
        cycleGroups.filter(c => c.children.length >= 2).forEach(cycleGroup => {
            if (Params.value.rotateMode === '3D') {
                cycleGroup.rotation.x = time * cycleXRotationSpeed;
            }
            cycleGroup.rotation.z = time * cycleGroupRotationSpeed / cycleGroup.children.length;
        });
    }

}