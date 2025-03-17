import GameGfxItem from './GameGfxItem.mjs';
import GameItem from '../core/GameItem.mjs';
import Cycle from '../core/Cycle.mjs';
import Params from '../Params.mjs';
import * as THREE from 'three';
import BubbleUtils from './BubbleUtils.mjs';

const angle = 2;
const partDistance = 0.05;
const radius = 1 - 2*partDistance;

const ballGeometry1 = new THREE.SphereGeometry(radius, 16, 8, -angle/2, angle);
const ballGeometry2 = new THREE.SphereGeometry(radius, 16, 8, angle/2, 2*Math.PI - angle);

const cycleMargin = 0.5;
const bubbleRotationSpeed = 0.25;
const cycleGroupRotationSpeed = 1.5;
const cycleXRotationSpeed = 0.5;

let CycleBubbleBuilder = {

    indexToBall(i) {
        let group = new THREE.Group();

        let part1 = BubbleUtils.indexToMesh(i, ballGeometry1);
        part1.rotation.x = Math.PI / 2;
        part1.rotation.y = Math.PI / 2;
        part1.position.y = -partDistance;
        group.add(part1);

        let part2 = BubbleUtils.indexToMesh(i, ballGeometry2);
        part2.rotation.x = Math.PI / 2;
        part2.rotation.y = Math.PI / 2;
        part2.position.y = partDistance;
        group.add(part2);

        return group;
    },

    cycleToGroup(cycle) {

        let balls = cycle.map(index => this.indexToBall(index));

        return BubbleUtils.createCircleGroup(balls, 1, cycleMargin, 0, true);
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
        GameGfxItem.configNewObject(this);
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