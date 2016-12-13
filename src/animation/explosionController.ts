"use strict";

import { FlameSphere } from "../object/flameSphere";
import { FlameAnimation } from "./flameAnimation";
import { Interpolation } from "./interpolation";
import { Controller } from "../controller";
import { Renderer } from "../renderer";

class ExplosionController {

  private static objs: FlameAnimation[];  
  private static spawnTime;

  public static init() {

    this.objs = [];
    this.spawnTime = 0;

    this.spawnNewFlame();

    Controller.attachEvent(Controller.SPAWN_DARK_COLOR, (value) => {
      for(let i=0; i<this.objs.length; i++) {
        this.objs[i].instance.setColor({ colDark: value });
      }
    });

    Controller.attachEvent(Controller.SPAWN_NORMAL_COLOR, (value) => {
      for(let i=0; i<this.objs.length; i++) {
        this.objs[i].instance.setColor({ colNormal: value });
      }
    });

    Controller.attachEvent(Controller.SPAWN_LIGHT_COLOR, (value) => {
      for(let i=0; i<this.objs.length; i++) {
        this.objs[i].instance.setColor({ colLight: value });
      }
    });

    this.reset();
  }

  public static reset() {
    for(let i=0; i<this.objs.length; i++) {
      this.objs[i].reset();
    }
  }

  private static spawnNewFlame() {
    let i = this.objs.length;
    this.objs.push(new FlameAnimation(
      new FlameSphere(Math.random() * 25 + 10),
      Math.random() * 30 - 15,
      Math.random() * 30 - 45,
      Math.random() * 0.6 + 0.7,
      Math.random() * 0.4 + 0.6
    ));
    Renderer.addToScene(this.objs[i].instance.getMesh());
  }

  public static update(deltaTime: number) {

    this.spawnTime += deltaTime;
    if(this.spawnTime > 400) {
      this.spawnTime -= 400;
      this.spawnNewFlame();
    }

    for(let i=0; i<this.objs.length; i++) {
      this.objs[i].update(deltaTime);
    }
  }
  
}

export { ExplosionController }