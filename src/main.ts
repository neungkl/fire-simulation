"use strict";

import { Renderer } from "./renderer";
import { AssetsManager } from "./assetsManager";
import { FlameSphere } from "./flameSphere";

$(() => {
  var renderer: Renderer = new Renderer();
  var start = Date.now();

  const onRequestAnimationFrame = () => {
    requestAnimationFrame(onRequestAnimationFrame);
    renderer.animate();
  }

  const sphere1: FlameSphere = new FlameSphere();

  let renderFunc = () => {
    sphere1.update();
  };

  renderer.addToScene(sphere1.getMesh());
  renderer.setRenderCallbackFunc(renderFunc);

  requestAnimationFrame(onRequestAnimationFrame);

  window.addEventListener('resize', renderer.onWindowResize, false);
});
