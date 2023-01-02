import * as THREE from 'three';

const white = new THREE.Color(0xffffff);

export default {
    fieldOfView: 60,
    cameraDistance: 1.732, // sqrt(3)
    aspectRatio: 16/9,
    near: 0.1,
    far: 1000,

    renderer: new THREE.WebGLRenderer(),
    scene: new THREE.Scene(),
    camera: null,
    objects: [],

    configure: function() {
        this.aspectRatio = window.innerWidth / window.innerHeight;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far);
        this.camera.position.z = this.cameraDistance;

        document.body.appendChild(this.renderer.domElement);
    },

    start: function() {

        this.addLights();

        this.loop();
    },

    addLights: function() {
        const dirLight = new THREE.DirectionalLight(white, 0.5);
        dirLight.position.set(1, 2, 1);
        dirLight.target.position.set(0, 0, 0);
        this.scene.add(dirLight);
        this.scene.add(dirLight.target);

        const ambLight = new THREE.AmbientLight(white, 0.3);
        this.scene.add(ambLight);
    },

    loop: function() {
        this.update();

        requestAnimationFrame( () => this.loop() );
    },

    update: function() {

        this.animateObjects();
        
        this.renderer.render(this.scene, this.camera);
    },

    animateObjects: function() {

        this.scene.children.forEach(obj => {
            if (obj.userData && obj.userData.animate) {
                obj.userData.animate();
            }
        });
    },
}