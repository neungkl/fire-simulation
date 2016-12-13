"use strict";

import { Renderer } from "./renderer";
import { AssetsManager } from "./assetsManager";
import { FlameSphere } from "./object/flameSphere";
import { Controller } from "./controller";
import { ExplosionController } from "./animation/explosionController";

$(() => {

  // Initialize
  Controller.init();
  Renderer.init();
  ExplosionController.init();

  var time = Date.now();

  const onRequestAnimationFrame = () => {
    requestAnimationFrame(onRequestAnimationFrame);
    Renderer.animate();
  }

  Renderer.setUpdateFunc(() => {
    ExplosionController.update(Date.now() - time);
    time = Date.now();
  });

  Controller.setRestartFunc(() => {
    ExplosionController.reset();
  });

  requestAnimationFrame(onRequestAnimationFrame);

  window.addEventListener('resize', () => { Renderer.onWindowResize() }, false);
});
