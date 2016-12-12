"use strict";

import { Renderer } from "./renderer"

$(() => {
  var renderer: Renderer = new Renderer();

  const onRequestAnimationFrame = () => {
    requestAnimationFrame(onRequestAnimationFrame);
    renderer.animate();
  }

  let mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(10, 4),
    new THREE.MeshBasicMaterial({
      color: 0xb7ff00,
      wireframe: true
    })
  );

  renderer.addToScene(mesh);

  requestAnimationFrame(onRequestAnimationFrame);

  renderer.textureLoader();

  window.addEventListener('resize', renderer.onWindowResize, false);
});
