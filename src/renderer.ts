"use strict";

import "./js/OrbitControl.js";
import { Controller } from "./controller";

class Renderer {
  private static scene: THREE.Scene;
  private static camera: THREE.PerspectiveCamera;
  private static renderer: THREE.WebGLRenderer;
  private static controls: THREE.OrbitControls;

  private static updateCallback = null;

  private static vertexFlameShader;
  private static fragmentFlameShader;

  private static gridHelper: THREE.GridHelper;

  public static init() {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f8f8);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Grid Helper
    this.gridHelper = new THREE.GridHelper(100, 40, 0xdddddd, 0xdddddd);
    this.scene.add(this.gridHelper);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // add this only if there is no animation loop (requestAnimationFrame)
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    this.camera.position.z = 75;
    this.camera.position.y = 75;
    this.camera.position.x = 75;

    Controller.attachEvent(Controller.INVERTED_BACKGROUND, (value) => {
      if(value) {
        this.scene.background = new THREE.Color(0x111111);
        this.scene.remove(this.gridHelper);
        this.gridHelper = new THREE.GridHelper(100, 40, 0x444444, 0x444444);
        this.scene.add(this.gridHelper);
      } else {
        this.scene.background = new THREE.Color(0xf8f8f8);
        this.scene.remove(this.gridHelper);
        this.gridHelper = new THREE.GridHelper(100, 40, 0xdddddd, 0xdddddd);
        this.scene.add(this.gridHelper);
      }
    });

    Controller.attachEvent(Controller.SHOW_GRID, (value) => {
      this.gridHelper.visible = value;
    });
  }

  public static animate() {
    this.controls.update();

    if (this.updateCallback != null) {
      this.updateCallback();
    }

    this.renderer.render(this.scene, this.camera);
  }

  public static addToScene(obj: any) {
    this.scene.add(obj);
  }

  public static removeFromScene(obj) {
    this.scene.remove(obj);
  }

  public static setUpdateFunc(func) {
    this.updateCallback = func;
  }

  public static onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export { Renderer };
