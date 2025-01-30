import Params from '../Params.mjs';
import * as THREE from 'three';
import { DragControls } from '../vendor/DragControls.js'
import { Object3D } from 'three';

const white = new THREE.Color(0xffffff);
const dockColor = new THREE.Color(0xa0a0a0);

export default {

    configured: false,
    dockRadius: 0.3,
    /** @type {Object3D} */
    dock: null,

    startTime: null,
    lastUpdate: null,
    totalTime: null,
    requestAnimationFrameId: null,
    started: false,

    fieldOfView: 20,
    cameraViewRadius: 1,
    cameraDistance: null,
    aspectRatio: 16/9,
    near: 0.1,
    far: 1000,

    /**
     * @type {THREE.WebGLRenderer}
     */
    renderer: null,
    scene: null,
    camera: null,
    /**
     * @type {DragControls}
     */
    controls: null,
    objects: [],

    dragstart: null,
    dragend: null,

    calculateAspectRatio() {
        this.aspectRatio = window.innerWidth / window.innerHeight;
    },

    configure() {
        const canvas = document.getElementById("game-canvas");

        this.configured = true;
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far);
        
        this.calculateCameraDistance();
        this.camera.position.z = this.cameraDistance;

        this.resize();

        window.addEventListener( 'resize', () => this.resize(), false );

        this.addDragListeners();
    },

    calculateCameraDistance() {
        this.cameraDistance = this.cameraViewRadius/Math.tan(2*Math.PI * (this.fieldOfView / 360)/2);
    },

    resize() {
        this.calculateAspectRatio();
        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.dock) {
            this.resetDock();
        }
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

    addDock() {
        const geometry = new THREE.CylinderGeometry(this.dockRadius, this.dockRadius, 1, 16);
        const material = new THREE.MeshBasicMaterial( {
            color: dockColor,
            transparent: true,
            opacity: 0.2
        } );
        this.dock = new THREE.Mesh( geometry, material );
        this.dock.name = 'dock';
        this.dock.renderOrder = 1;
        this.scene.add( this.dock );
        this.resetDock();
    },

    resetDock() {
        let pos = -1 + this.dockRadius;
        let angle = -Math.atan2(pos, this.cameraDistance);
        
        this.dock.scale.setY(2 * this.aspectRatio);
        this.dock.position.y = pos;
        this.dock.rotation.y = angle;
        this.dock.rotation.z = Math.PI/2;
        this.objects.filter(object => object.userData && object.userData.isOnDock)
            .forEach(object => {
                object.position.setY(this.dock.position.y);
                object.userData.fixPosition();
            });
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

    /**
     * @param {Object3D} object 
     */
    addObject(object) {
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
        this.startTime = Date.now();

        this.objects.forEach(obj => this.removeObject(obj));
        this.scene.remove.apply(this.scene, this.scene.children);

        if (Params.value.lightningEnabled) {
            this.addLights();
        }
        this.addDock();

        this.loop();
    },

    resetTime() {
        this.startTime = Date.now();
    },

    stop() {
        if (!this.started) return;

        if (this.requestAnimationFrameId) {
            cancelAnimationFrame(this.requestAnimationFrameId);
        }
        this.started = false;
    },

    loop() {
        let now = Date.now();
        this.dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        this.totalTime = (this.lastUpdate - this.startTime) / 1000;

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
                obj.userData.animate(this.dt, this.totalTime);
            }
        });
    },

    cancelDrag() {
        this.controls.deselect();
    },
}
