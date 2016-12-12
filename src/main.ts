"use strict";

import { Renderer } from "./renderer"

var renderer: Renderer = new Renderer();

const onRequestAnimationFrame = () => {
  requestAnimationFrame(onRequestAnimationFrame);
  renderer.animate();
}

requestAnimationFrame(onRequestAnimationFrame);

window.addEventListener('resize', renderer.onWindowResize, false);

//test aasdas
