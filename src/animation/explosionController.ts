"use strict";

import { FlameSphere } from "../object/flameSphere";
import { FlameAnimation } from "./flameAnimation";
import { Interpolation } from "./interpolation";
import { Controller } from "../controller";
import { Renderer } from "../renderer";

class ExplosionController {

  private static objs: FlameAnimation[];
  private static objectPool: number[];
  private static spawnTime;

  private static currentCol = {};

  public static init() {

    this.objs = [];
    this.objectPool = [];
    this.spawnTime = 0;

    this.spawnNewFlame();

    Controller.attachEvent(Controller.DARK_COLOR, (value) => {
      for(let i=0; i<this.objs.length; i++) {
        this.currentCol['colDark'] = value;
        this.objs[i].instance.setColor({ colDark: value });
      }
    });

    Controller.attachEvent(Controller.NORMAL_COLOR, (value) => {
      for(let i=0; i<this.objs.length; i++) {
        this.currentCol['colNormal'] = value;
        this.objs[i].instance.setColor({ colNormal: value });
      }
    });

    Controller.attachEvent(Controller.LIGHT_COLOR, (value) => {
      for(let i=0; i<this.objs.length; i++) {
        this.currentCol['colLight'] = value;
        this.objs[i].instance.setColor({ colLight: value });
      }
    });

    this.reset();
  }

  public static reset() {
    for(let i=0; i<this.objs.length; i++) {
      this.objs[i].reset();
      Renderer.removeFromScene(this.objs[i].instance.getMesh());
    }
    this.objectPool = [];
    this.objs = [];
  }

  private static spawnNewFlame() {
    let i = this.objs.length;

    if(this.objectPool.length > 0) {
      i = this.objectPool.shift();
      this.objs[i].instance.getMesh().visible = true;
      this.objs[i].instance.setColor(this.currentCol);
      this.objs[i].reset();
    } else {
      let obj = new FlameAnimation(
        new FlameSphere(Math.random() * 5 + 8),
        Math.random() * 7 - 4,
        Math.random() * 7 - 4,
        Math.random() * 0.4 + 0.35,
        Math.random() * 0.4 + 0.3
      );
      obj.instance.setColor(this.currentCol);
      this.objs.push(obj);
      Renderer.addToScene(this.objs[i].instance.getMesh());
    }
  }

  public static update(deltaTime: number) {

    this.spawnTime += deltaTime;
    if(this.spawnTime > 200) {
      while(this.spawnTime > 200) this.spawnTime -= 200;
      this.spawnNewFlame();
    }

    for(let i=0; i<this.objs.length; i++) {
      if(this.objs[i].isDie()) {
        if(this.objs[i].inPolling()) continue;

        this.objs[i].setInPolling(true);
        this.objs[i].instance.getMesh().visible = false;
        this.objectPool.push(i);
      } else {
        this.objs[i].update(deltaTime);
      }
    }
  }
  
}

export { ExplosionController }