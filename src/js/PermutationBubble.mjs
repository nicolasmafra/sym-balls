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
const ballGeometry = new THREE.SphereGeometry(1, 16, 8);
const bubbleGeometry = new THREE.SphereGeometry(1, 32, 16);
const white = new THREE.Color(0xffffff);

const bubbleOpacity = 0.3;
const cycleMargin = 0.5;
const bubbleMargin = 0.4;
const bubbleRotationSpeed = 0.005;
const cycleGroupRotationSpeed = 0.03;

export default {

    indexToBall(i, params) {
        const color = colorList[i];

        const materialParams = {
            color: color,
        };
        const material = params.lightningEnabled
            ? new THREE.MeshPhongMaterial(materialParams)
            : new THREE.MeshBasicMaterial(materialParams);
        
        return new THREE.Mesh(ballGeometry, material);
    },

    cycleToGroup(cycle, params) {

        let balls = cycle.map(index => this.indexToBall(index, params));

        return this.createCircleGroup(balls, 1, cycleMargin);
    },

    cyclesToBubble(cycles, params) {

        let cycleGroups = cycles.map(cycle => this.cycleToGroup(cycle, params));
        let group = this.createCircleGroup(cycleGroups, 1, bubbleMargin);

        const materialParams = {
            color: white,
            transparent: true,
            opacity: bubbleOpacity
        };
        const material = params.lightningEnabled
            ? new THREE.MeshPhongMaterial(materialParams)
            : new THREE.MeshBasicMaterial(materialParams);
        
        const bubble = new THREE.Mesh(bubbleGeometry, material);
        bubble.add(group);
        bubble.scale.multiplyScalar(bubbleSize/2);

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

    animateBubble(bubble) {
        bubble.children[0].rotation.x += bubbleRotationSpeed;
        bubble.children[0].rotation.z += bubbleRotationSpeed;

        let cycleGroups = bubble.children[0].children;
        cycleGroups.filter(c => c.children.length >= 2).forEach(cycleGroup => {
            cycleGroup.rotation.z += cycleGroupRotationSpeed / cycleGroup.children.length;
        });
    },
}