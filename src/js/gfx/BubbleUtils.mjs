import * as THREE from 'three';
import Params from "../Params.mjs";

const bubbleSize = 0.17;
const bubbleRadius = bubbleSize/2;
const bubbleGeometry = new THREE.SphereGeometry(1, 32, 16);
const bubbleOpacity = 0.3;
const bubbleMargin = 0.4;
const flatBubbleDistance = 2;

const white = new THREE.Color(0xffffff);

const outlineFactor = 1.05;
const lockedOutlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4400,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.8
});
const limitedOutlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.8
});

export default {
    bubbleSize,
    colorList: [
        0xff0000,
        0x00ff00,
        0x0000ff,

        0xffff00,
        0x00ffff,
        0xff00ff,

        0xffffff,
        0x606060,

        0xff8800,
        0x00ff88,
        0x8800ff,

        0x884422,
    ],

    /**
     * 
     * @param {THREE.Object3D[]} children 
     * @param {number} maxChildRadius 
     * @param {number} margin 
     * @returns {THREE.Group}
     */
    createCircleGroup(children, maxChildRadius, margin, angleOffset = 0) {
        const group = new THREE.Group();
        children.forEach(child => group.add(child));

        const radius = this.regularPolygonCircumradius(children.length, 2 * maxChildRadius);
        this.makeCircleWithObjects(children, radius, angleOffset);
        const realRadius = radius + maxChildRadius + margin;
        group.scale.divideScalar(realRadius);

        return group;
    },

    /**
     * @param {THREE.Object3D[]} objects
     * @param {number} radius 
     */
    makeCircleWithObjects(objects, radius, angleOffset = 0) {
        let angle = 2 * Math.PI / objects.length;
        objects.forEach((obj, i) => {
            obj.position.x = radius * Math.cos(angleOffset + i * angle);
            obj.position.y = radius * Math.sin(angleOffset + i * angle);
        });
    },

    regularPolygonCircumradius(n, side) {
        if (n <= 1) {
            return 0;
        }
        return side / (2 * Math.sin(Math.PI / n));
    },

    indexToMesh(index, geometry) {
        const color = this.colorList[index];

        const materialParams = {
            color: color,
        };
        const material = Params.value.lightningEnabled
            ? new THREE.MeshPhongMaterial(materialParams)
            : new THREE.MeshBasicMaterial(materialParams);
        
        return new THREE.Mesh(geometry, material);
    },

    makeBubble(subGroups) {

        let angleOffset = Math.PI / 2;
        let group = this.createCircleGroup(subGroups, 1, bubbleMargin, angleOffset);
        group.name = 'content';

        const materialParams = {
            color: white,
            transparent: true,
            opacity: bubbleOpacity
        };
        const material = Params.value.lightningEnabled
            ? new THREE.MeshPhongMaterial(materialParams)
            : new THREE.MeshBasicMaterial(materialParams);
        
        const bubble = new THREE.Mesh(bubbleGeometry, material);
        bubble.add(group);
        bubble.scale.multiplyScalar(bubbleRadius);

        return bubble;
    },

    makeFlatBubble(subGroups) {
        const n = subGroups.length;
        const xOffset = -flatBubbleDistance * (n - 1) / 2;

        const group = new THREE.Group();
        subGroups.forEach(child => group.add(child));
        group.name = 'content';

        subGroups.forEach((obj, i) => {
            obj.position.x = xOffset + i * flatBubbleDistance;
        });
        group.scale.setScalar(1/n);

        const materialParams = {
            color: white,
            transparent: true,
            opacity: bubbleOpacity
        };
        const material = Params.value.lightningEnabled
            ? new THREE.MeshPhongMaterial(materialParams)
            : new THREE.MeshBasicMaterial(materialParams);
        
        const bubble = new THREE.Mesh(bubbleGeometry, material);
        bubble.add(group);
        bubble.scale.multiplyScalar(bubbleRadius);

        return bubble;
    },

    addLockedOutline(bubble) {
        this.addOutline(bubble, lockedOutlineMaterial);
    },

    addLimitedOutline(bubble) {
        this.addOutline(bubble, limitedOutlineMaterial);
    },

    addOutline(bubble, material) {
        var mesh = new THREE.Mesh( bubbleGeometry, material );
        mesh.renderOrder = 0;
        mesh.name = 'outline';
        mesh.scale.multiplyScalar(outlineFactor);
        bubble.add(mesh);
    },
}