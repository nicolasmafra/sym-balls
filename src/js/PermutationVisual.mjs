import * as THREE from 'three';

const colorList = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xffff00,
    0x00ffff,
    0xff00ff,
];
const ballRadius = 1;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 8);
const cycleScale = 0.2;

export default {

    indexToBall: function(i) {
        const color = colorList[i];
        const material = new THREE.MeshPhongMaterial({color});
        return new THREE.Mesh(ballGeometry, material);
    },

    cycleToGroup: function(cycle) {
        const group = new THREE.Group();
        cycle.map(this.indexToBall).forEach(ball => group.add(ball));
        const radius = this.regularPolygonCircumradius(cycle.length, 2 * ballRadius);
        this.makeCircleWithChildren(group, radius);
        group.scale.multiplyScalar(cycleScale);
        return group;
    },

    regularPolygonCircumradius: function(n, side) {
        if (n <= 1) {
            return 0;
        }
        return side / (2 * Math.sin(Math.PI / n));
    },

    makeCircleWithChildren(group, radius) {
        let angle = 2 * Math.PI / group.children.length;
        group.children.forEach((obj, i) => {
            obj.position.x = radius * Math.cos(i * angle);
            obj.position.y = radius * Math.sin(i * angle);
        });
    },
}