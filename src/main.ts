"use strict";

import { Renderer } from "./renderer";
import { AssetsManager } from "./assetsManager";
import { FlameSphere } from "./flameSphere";
import { Controller } from "./controller";

$(() => {
  var renderer: Renderer = new Renderer();

  // Controller Initialize
  Controller.init();

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

  Controller.attachEvent(Controller.SPAWN_DARK_COLOR, (value) => {
    sphere1.setColor({ colDark: value });
  });

  Controller.attachEvent(Controller.SPAWN_NORMAL_COLOR, (value) => {
    sphere1.setColor({ colNormal: value });
  });

  Controller.attachEvent(Controller.SPAWN_LIGHT_COLOR, (value) => {
    sphere1.setColor({ colLight: value });
  });

  requestAnimationFrame(onRequestAnimationFrame);

  window.addEventListener('resize', () => { renderer.onWindowResize() }, false);
});
