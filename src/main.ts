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
  // const sphere2: FlameSphere = new FlameSphere(0, 10, 0);

  let renderFunc = () => {
    sphere1.update();
    // sphere2.update();
  };

  renderer.addToScene(sphere1.getMesh());
  // renderer.addToScene(sphere2.getMesh());
  renderer.setRenderCallbackFunc(renderFunc);

  requestAnimationFrame(onRequestAnimationFrame);

  window.addEventListener('resize', renderer.onWindowResize, false);
});
