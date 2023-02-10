import Params from './Params.mjs';
import * as THREE from 'three';

const colorList = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xffff00,
    0x00ffff,
    0xff00ff,
];
const bubbleSize = 0.5;
const bubbleRadius = bubbleSize/2;
const ballGeometry = new THREE.SphereGeometry(1, 16, 8);
const bubbleGeometry = new THREE.SphereGeometry(1, 32, 16);
const white = new THREE.Color(0xffffff);

const bubbleOpacity = 0.3;
const cycleMargin = 0.5;
const bubbleMargin = 0.4;
const bubbleRotationSpeed = 0.25;
const cycleGroupRotationSpeed = 1.5;
const cycleXRotationSpeed = 0.5;
const oscillationSpeed = 1.0 * Math.PI;
const oscillationAmplitudeRatio = 0.05;
const oscillationAmplitude = oscillationAmplitudeRatio * bubbleRadius;

export default {

    indexToBall(i) {
        const color = colorList[i];

        const materialParams = {
            color: color,
        };
        const material = Params.value.lightningEnabled
            ? new THREE.MeshPhongMaterial(materialParams)
            : new THREE.MeshBasicMaterial(materialParams);
        
        return new THREE.Mesh(ballGeometry, material);
    },

    cycleToGroup(cycle) {

        let balls = cycle.map(index => this.indexToBall(index));

        return this.createCircleGroup(balls, 1, cycleMargin);
    },

    cyclesToBubble(cycles) {

        let cycleGroups = cycles.map(cycle => this.cycleToGroup(cycle));
        let group = this.createCircleGroup(cycleGroups, 1, bubbleMargin);

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

    regularPolygonCircumradius(n, side) {
        if (n <= 1) {
            return 0;
        }
        return side / (2 * Math.sin(Math.PI / n));
    },

    createCircleGroup(children, maxChildRadius, margin) {
        const group = new THREE.Group();
        children.forEach(child => group.add(child));

        const radius = this.regularPolygonCircumradius(children.length, 2 * maxChildRadius);
        this.makeCircleWithObjects(children, radius);
        const realRadius = radius + maxChildRadius + margin;
        group.scale.divideScalar(realRadius);

        return group;
    },

    makeCircleWithObjects(objects, radius) {
        let angle = 2 * Math.PI / objects.length;
        objects.forEach((obj, i) => {
            obj.position.x = radius * Math.cos(i * angle);
            obj.position.y = radius * Math.sin(i * angle);
        });
    },

    animateBubble(bubble, dt, time) {
        if (Params.value.itemOscillation) {
            this.oscilateGroupSize(bubble, time);
        }
        if (Params.value.rotateCycles !== 'DISABLED') {
            this.rotateBubble(bubble, time);
        }
    },

    oscilateGroupSize(bubble, time) {
        let cos = Math.cos(time * oscillationSpeed);
        bubble.scale.setScalar(bubbleRadius * (1 + oscillationAmplitude * cos));
    },

    rotateBubble(bubble, time) {
        if (Params.value.rotateCycles === '3D') {
            bubble.children[0].rotation.x = time * bubbleRotationSpeed;
        }
        bubble.children[0].rotation.z = time * bubbleRotationSpeed;

        let cycleGroups = bubble.children[0].children;
        cycleGroups.filter(c => c.children.length >= 2).forEach(cycleGroup => {
            if (Params.value.rotateCycles === '3D') {
                cycleGroup.rotation.x = time * cycleXRotationSpeed;
            }
            cycleGroup.rotation.z = time * cycleGroupRotationSpeed / cycleGroup.children.length;
        });
    }
}