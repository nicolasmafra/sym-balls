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
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far);
        this.camera.position.z = 5;

        document.body.appendChild(this.renderer.domElement);
    },

    start: function() {

        this.addLights();

        this.addSampleObject();

        this.loop();
    },

    addLights: function() {
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(1, 2, 1);
        dirLight.target.position.set(0, 0, 0);
        this.scene.add(dirLight);
        this.scene.add(dirLight.target);

        const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambLight);
    },

    loop: function() {
        this.update();

        requestAnimationFrame( () => this.loop() );
    },

    update: function() {

        this.updateSampleObject();
        
        this.renderer.render(this.scene, this.camera);
    },

    addSampleObject: function() {
        const geometry = new THREE.SphereGeometry( 1, 16, 8 );
        const material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
        this.obj = new THREE.Mesh(geometry, material);

        this.scene.add(this.obj);
    },

    updateSampleObject: function() {
        this.obj.rotation.x += 0.01;
        this.obj.rotation.y += 0.01;
    },
}
