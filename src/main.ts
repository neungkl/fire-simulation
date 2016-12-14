/// <reference path="./js/stats.d.ts" />

"use strict";

import { Renderer } from "./renderer";
import { AssetsManager } from "./assetsManager";
import { FlameSphere } from "./object/flameSphere";
import { Controller } from "./controller";
import { ExplosionController } from "./animation/explosionController";

window.onload = () => {

  var time = Date.now();
  var timeScale;
  
  var stats = new Stats();
  stats.showPanel(0);

  document.getElementById("stats").appendChild(stats.domElement);

  // Initialize
  Controller.init();
  Renderer.init();
  ExplosionController.init();

  timeScale = Controller.getParams().TimeScale;

  const onRequestAnimationFrame = () => {
    requestAnimationFrame(onRequestAnimationFrame);
    stats.begin();
    Renderer.animate();
    stats.end();
  }

  let deltaTimeMaximum = 1000 / 65;

  Renderer.setUpdateFunc(() => {
    let timeDiff = (Date.now() - time);
    ExplosionController.update(timeDiff > deltaTimeMaximum ? deltaTimeMaximum : timeDiff);
    time = Date.now();
  });
  Controller.setRestartFunc(() => {
    ExplosionController.reset();
  });

  requestAnimationFrame(onRequestAnimationFrame);

  window.addEventListener('resize', () => { Renderer.onWindowResize() }, false);
};
