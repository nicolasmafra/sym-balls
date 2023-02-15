import * as THREE from 'three';
import Params from "../Params.mjs";

const bubbleSize = 0.5;
const bubbleRadius = bubbleSize/2;
const bubbleGeometry = new THREE.SphereGeometry(1, 32, 16);
const bubbleOpacity = 0.3;
const bubbleMargin = 0.4;

const white = new THREE.Color(0xffffff);

export default {
    colorList: [
        0xff0000,
        0x00ff00,
        0x0000ff,
        0xffff00,
        0x00ffff,
        0xff00ff,
    ],

    /**
     * 
     * @param {THREE.Object3D[]} children 
     * @param {number} maxChildRadius 
     * @param {number} margin 
     * @returns {THREE.Group}
     */
    createCircleGroup(children, maxChildRadius, margin) {
        const group = new THREE.Group();
        children.forEach(child => group.add(child));

        const radius = this.regularPolygonCircumradius(children.length, 2 * maxChildRadius);
        this.makeCircleWithObjects(children, radius);
        const realRadius = radius + maxChildRadius + margin;
        group.scale.divideScalar(realRadius);

        return group;
    },

    /**
     * @param {THREE.Object3D[]} objects
     * @param {number} radius 
     */
    makeCircleWithObjects(objects, radius) {
        let angle = 2 * Math.PI / objects.length;
        objects.forEach((obj, i) => {
            obj.position.x = radius * Math.cos(i * angle);
            obj.position.y = radius * Math.sin(i * angle);
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

    makeBubble(subGroups,) {

        let group = this.createCircleGroup(subGroups, 1, bubbleMargin);

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
}