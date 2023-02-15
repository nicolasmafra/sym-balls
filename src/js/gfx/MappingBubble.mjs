import GameGfxItem from './GameGfxItem.mjs';
import GameItem from '../core/GameItem.mjs';
import Params from '../Params.mjs';
import * as THREE from 'three';
import BubbleUtils from './BubbleUtils.mjs';

const bubbleSize = 0.5;
const bubbleRadius = bubbleSize/2;
const ballGeometry = new THREE.SphereGeometry(1, 16, 8);
const pyramidGeometry = new THREE.SphereGeometry(1, 3, 2);

const mappingDistance = 0.6;
const mappingMargin = 0.5;
const bubbleRotationSpeed = 0.25;
const cycleGroupRotationSpeed = 1.5;
const cycleXRotationSpeed = 0.5;
const oscillationSpeed = 1.0 * Math.PI;
const oscillationAmplitudeRatio = 0.05;
const oscillationAmplitude = oscillationAmplitudeRatio * bubbleRadius;

let MappingBubbleBuilder = {

    indexToBall(i) {
        return BubbleUtils.indexToMesh(i, ballGeometry);
    },

    indexToPyramid(i) {
        return BubbleUtils.indexToMesh(i, pyramidGeometry);
    },

    mappingToGroup(m) {
        let ball = this.indexToBall(m.from);
        ball.position.setX(-mappingDistance);
        let pyramid = this.indexToPyramid(m.to);
        pyramid.position.setX(mappingDistance);
        pyramid.scale.setX(-1);
        let children = [ball, pyramid];

        const group = new THREE.Group();
        children.forEach(child => group.add(child));
        let radius = 0.5 + mappingDistance + mappingMargin;
        group.scale.divideScalar(radius);

        return group;
    },

    build(mapping) {

        let subGroups = mapping.map(m => this.mappingToGroup(m));

        return BubbleUtils.makeBubble(subGroups);
    },
};

export default class MappingBubble extends GameGfxItem {

    mapping = null;

    /**
     * @param {GameItem} gameItem 
     */
    constructor(gameItem) {
        super();
        this.gameItem = gameItem;
        this.mapping = gameItem.getPermutation()
            .map((p, i) => ({
                from: i,
                to: p
            })).filter(m => m.from != m.to);
        this.gfxObject = MappingBubbleBuilder.build(this.mapping);
        GameGfxItem.configNewObject(this);
    }

    createNewFrom(gameItem) {
        return new MappingBubble(gameItem);
    }

    animate(dt, time) {
        if (Params.value.itemOscillation) {
            this.#oscilateGroupSize(time);
        }
        if (Params.value.rotateMode !== 'DISABLED') {
            this.#rotate(time);
        }
    }

    #oscilateGroupSize(time) {
        let cos = Math.cos(time * oscillationSpeed);
        this.gfxObject.scale.setScalar(bubbleRadius * (1 + oscillationAmplitude * cos));
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