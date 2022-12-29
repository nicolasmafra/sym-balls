import * as THREE from 'three';

export default {
    fieldOfView: 75,
    aspectRatio: 16/9,
    near: 0.1,
    far: 1000,

    renderer: new THREE.WebGLRenderer(),
    scene: new THREE.Scene(),
    camera: null,

    configure: function() {
        this.aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far);

        document.body.appendChild(this.renderer.domElement);
    },

    start: function() {
        this.renderer.render(this.scene, this.camera);
    },
}
