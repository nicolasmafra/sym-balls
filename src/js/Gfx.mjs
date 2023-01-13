import Params from './Params.mjs';
import * as THREE from 'three';
import { DragControls } from './vendor/DragControls.js'

const white = new THREE.Color(0xffffff);

export default {
    domContainer: null,
    requestAnimationFrameId: null,
    started: false,

    fieldOfView: 60,
    cameraDistance: 1.732, // sqrt(3)
    aspectRatio: 16/9,
    near: 0.1,
    far: 1000,

    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    objects: [],

    dragstart: null,
    dragend: null,

    calculateAspectRatio() {
        this.aspectRatio = window.innerWidth / window.innerHeight;
    },

    configure() {
        this.calculateAspectRatio();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far);
        this.camera.position.z = this.cameraDistance;

        if (!this.domContainer) this.domContainer = document.body;

        this.domContainer.appendChild(this.renderer.domElement);

        window.addEventListener( 'resize', () => this.resize(), false );

        this.addDragListeners();
    },

    resize() {
        this.calculateAspectRatio();
        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    addLights() {
        const dirLight = new THREE.DirectionalLight(white, 0.5);
        dirLight.position.set(1, 2, 1);
        dirLight.target.position.set(0, 0, 0);
        this.scene.add(dirLight);
        this.scene.add(dirLight.target);

        const ambLight = new THREE.AmbientLight(white, 0.3);
        this.scene.add(ambLight);
    },

    addDragListeners() {
        this.controls = new DragControls([], this.camera, this.renderer.domElement);

        this.controls.addEventListener( 'dragstart', e => {
            if (this.dragstart) {
                this.dragstart(e.object);
            }
        });
        
        this.controls.addEventListener( 'dragend', e => {
            if (this.dragend) {
                this.dragend(e.object);
            }
        } );
    },

    addObject(object, objectReference) {
        if (objectReference) {
            object.position.copy(objectReference.position);
        }
        this.objects.push(object);
        this.scene.add(object);
        this.controls.getObjects().push(object);
    },

    removeObject(object) {
        this.objects = this.objects.filter(x => x != object);
        const index = this.controls.getObjects().indexOf(object);
        if (index > -1) {
            this.controls.getObjects().splice(index, 1);
        }
        this.scene.remove(object);
    },

    start() {
        if (this.started) return;

        this.started = true;

        this.objects.forEach(obj => this.removeObject(obj));
        this.scene.remove.apply(this.scene, this.scene.children);

        if (Params.value.lightningEnabled) {
            this.addLights();
        }

        this.loop();
    },

    stop() {
        if (!this.started) return;

        if (this.requestAnimationFrameId) {
            cancelAnimationFrame(this.requestAnimationFrameId);
        }
        this.started = false;
    },

    loop() {
        this.requestAnimationFrameId = null;
        
        this.update();

        this.requestAnimationFrameId = requestAnimationFrame( () => this.loop() );
    },

    update() {

        this.animateObjects();
        
        this.renderer.render(this.scene, this.camera);
    },

    animateObjects() {

        this.scene.children.forEach(obj => {
            if (obj.userData && obj.userData.animate) {
                obj.userData.animate();
            }
        });
    },
}
