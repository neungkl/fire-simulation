"use strict";

import "./js/OrbitControl.js";

class Renderer {
  private scene;
  private camera;
  private renderer;
  private controls;

  private cube;

  private vertexFlameShader;
  private fragmentFlameShader;

  constructor() {

    let material, geometry;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f8f8);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Grid Helper
    this.scene.add(new THREE.GridHelper(100, 40, 0xdddddd, 0xdddddd));

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
		this.controls.enableZoom = true;

    this.camera.position.z = 15;
    this.camera.position.y = 15;
    this.camera.position.x = 15;
  }

  public animate() {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public addToScene(obj: any) {
    this.scene.add(obj);
  }

  public textureLoader() {
    $.ajax({
      url: './dist/shader/vertexFlameShader.vs',
      async: false,
      success: (vs) => {
        console.log(vs);
      }
    });
  }

  public onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
}

export { Renderer }
