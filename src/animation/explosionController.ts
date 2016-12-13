"use strict";

import { FlameSphere } from "../object/flameSphere";
import { Renderer } from "../renderer";
import { Controller } from "../controller";
import { Interpolation } from "./interpolation";

class ExplosionController {

  private static sphere1: FlameSphere;
  private static currentTime;

  private static STATE_BEFORE_START: number = 0;
  private static STATE_SPAWN: number = 1;
  private static STATE_IDLE: number = 2;

  private static IDLE_INTERVAL: number = 250;
  private static SPAWN_INTERVAL: number = 500;

  private static currentState;

  public static init() {

    this.sphere1 = new FlameSphere();
    // const sphere2: FlameSphere = new FlameSphere(0, 10, 0);

    Renderer.addToScene(this.sphere1.getMesh());
    // renderer.addToScene(sphere2.getMesh());

    Controller.attachEvent(Controller.SPAWN_DARK_COLOR, (value) => {
      this.sphere1.setColor({ colDark: value });
    });

    Controller.attachEvent(Controller.SPAWN_NORMAL_COLOR, (value) => {
      this.sphere1.setColor({ colNormal: value });
    });

    Controller.attachEvent(Controller.SPAWN_LIGHT_COLOR, (value) => {
      this.sphere1.setColor({ colLight: value });
    });

    this.reset();
  }

  public static reset() {

    this.currentTime = 0;
    this.currentState = this.STATE_BEFORE_START;

    this.sphere1.getMesh().position.set(0,0,0);
    this.sphere1.getMesh().scale.set(0, 0, 0);
  }

  private static updateState(deltaTime: number) {
    let cTime = this.currentTime + deltaTime;
    
    if(this.currentState == this.STATE_BEFORE_START) {
      if(cTime > this.IDLE_INTERVAL) {
        cTime -= this.IDLE_INTERVAL;
        this.currentState = this.STATE_SPAWN;
      }
    } else if(this.currentState == this.STATE_SPAWN) {
      if(cTime > this.SPAWN_INTERVAL) {
        cTime -= this.SPAWN_INTERVAL;
        this.currentState = this.STATE_IDLE;
      }
    } else if(this.currentState == this.STATE_IDLE) {

    }

    this.currentTime = cTime;
  }

  public static update(deltaTime: number) {

    this.updateState(deltaTime);

    let mesh = this.sphere1.getMesh();

    if(this.currentState == this.STATE_SPAWN) {

      let t = Interpolation.easeOutQuint(
        this.currentTime / this.SPAWN_INTERVAL,
        0, 1
      );

      console.log(t);

      mesh.position.setY(t * 20);

      let scale = t * 1;
      mesh.scale.set(scale, scale, scale);
    }

    this.sphere1.update(deltaTime);
  }
}

export { ExplosionController }