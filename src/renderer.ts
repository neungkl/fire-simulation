"use strict";

class Renderer {
  private scene;
  private camera;
  private renderer;

  private cube;

  constructor() {

    var material, geometry;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  public animate() {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
    this.renderer.render(this.scene, this.camera);
  }
}

export { Renderer }
