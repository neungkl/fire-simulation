import { FlameSphere } from "../object/flameSphere";
import { Renderer } from "../renderer";
import { Controller } from "../controller";
import { Interpolation } from "./interpolation";

class FlameAnimation {

  private static STATE_BEFORE_START: number = 0;
  private static STATE_SPAWN: number = 1;
  private static STATE_SPAWN_DOWN: number = 2;
  private static STATE_FLOATING: number = 3;
  private static STATE_IDLE: number = 4;

  private static BEFORE_INTERVAL: number = 250;
  private static SPAWN_INTERVAL: number = 300;
  private static SPAWN_DOWN_INTERVAL: number = 1200;
  private static FLOATING_INTERVAL: number = 7500;
  private static IDLE_INTERVAL: number = 5000;

  public instance: FlameSphere;
  public distX: number;
  public distZ: number;
  public yRatio: number;
  public animationTimeRatio: number;

  private currentTime;
  private timeCount;
  private spawnTime;
  private isObjDie;
  private isInPooling;

  private currentState;
  private posX;
  private posY;
  private posZ;

  private randFlyX;
  private randFlyZ;

  constructor(instance, distX?: number, distZ?: number, yRatio?: number, animationTimeRatio?: number) {

    distX = distX || 0;
    distZ = distZ || 0;
    yRatio = yRatio || 1;
    animationTimeRatio = animationTimeRatio || 1;

    this.instance = instance;
    this.distX = distX;
    this.distZ = distZ;
    this.yRatio = yRatio;
    this.animationTimeRatio = animationTimeRatio;

    this.reset();
  }

  public reset() {

    this.randFlyX = Math.random() * 0.15 - 0.05;
    this.randFlyZ = Math.random() * 0.15 - 0.05;

    this.posX = -1;
    this.currentTime = 0;
    this.timeCount = 0;
    this.spawnTime = 0;
    this.isObjDie = false;
    this.isInPooling = false;
    this.currentState = FlameAnimation.STATE_BEFORE_START;

    this.instance.getMesh().position.set(0, 0, 0);
    this.instance.getMesh().scale.set(0, 0, 0);
  }

  private setColor() {
    let params = Controller.getParams();

    if (this.timeCount < 2500) {
      this.instance.setColor({
        colDark: params.LightColor2,
        colNormal: params.LightColor2,
        colLight: params.LightColor
      });
    } else if (this.timeCount < 4000) {
      this.instance.setColor({
        colDark: params.LightColor,
        colNormal: params.NormalColor,
        colLight: params.LightColor
      });
    } else if (this.timeCount < 7500) {
      this.instance.setColor({
        colDark: params.DarkColor2,
        colNormal: params.NormalColor,
        colLight: params.LightColor
      });
    } else if (this.timeCount < 9000) {
      this.instance.setColor({
        colDark: params.DarkColor,
        colNormal: params.DarkColor2,
        colLight: params.NormalColor
      });
    } else {
      this.instance.setColor({
        colDark: params.DarkColor,
        colNormal: params.DarkColor,
        colLight: params.DarkColor2
      });
    }
  }

  private updateState(deltaTime: number) {

    let cTime = this.currentTime + deltaTime;

    if (this.currentState == FlameAnimation.STATE_BEFORE_START) {
      if (cTime > FlameAnimation.BEFORE_INTERVAL) {
        cTime -= FlameAnimation.BEFORE_INTERVAL;
        this.currentState = FlameAnimation.STATE_SPAWN;
      }
    } else if (this.currentState == FlameAnimation.STATE_SPAWN) {
      if (cTime > FlameAnimation.SPAWN_INTERVAL) {
        cTime -= FlameAnimation.SPAWN_INTERVAL;
        this.posX = -1;
        this.currentState = FlameAnimation.STATE_SPAWN_DOWN;
      }
    } else if (this.currentState == FlameAnimation.STATE_SPAWN_DOWN) {
      if (cTime > FlameAnimation.SPAWN_DOWN_INTERVAL) {
        cTime -= FlameAnimation.SPAWN_DOWN_INTERVAL;
        this.currentState = FlameAnimation.STATE_FLOATING;
      }
    } else if (this.currentState == FlameAnimation.STATE_FLOATING) {
      if (cTime > FlameAnimation.FLOATING_INTERVAL) {
        cTime -= FlameAnimation.FLOATING_INTERVAL;
        this.posX = -1;
        this.currentState = FlameAnimation.STATE_IDLE
      }
    } else if (this.currentState == FlameAnimation.STATE_IDLE) {
      if (cTime > FlameAnimation.IDLE_INTERVAL) {
        this.isObjDie = true;
      }
    }

    this.currentTime = cTime;
  }

  public update(deltaTime: number) {

    if (this.isObjDie) return;

    this.updateState(deltaTime);
    this.timeCount += deltaTime;

    let mesh = this.instance.getMesh();

    if (this.currentState == FlameAnimation.STATE_SPAWN) {

      let t = this.currentTime / FlameAnimation.SPAWN_INTERVAL;

      let t2 = this.currentTime / (FlameAnimation.SPAWN_INTERVAL + FlameAnimation.SPAWN_DOWN_INTERVAL);

      mesh.position.set(
        this.distX * t2,
        mesh.position.y + t * 0.4 * this.yRatio,
        this.distZ * t2
      );

      let scale = t;
      mesh.scale.set(scale, scale, scale);
    }
    else if (this.currentState == FlameAnimation.STATE_SPAWN_DOWN) {

      let t2 = (this.currentTime + FlameAnimation.SPAWN_INTERVAL) /
        (FlameAnimation.SPAWN_INTERVAL + FlameAnimation.SPAWN_DOWN_INTERVAL);

      mesh.position.set(
        this.distX * t2,
        mesh.position.y +
        (0.6 * (1 - this.currentTime / FlameAnimation.SPAWN_DOWN_INTERVAL) + 0.2) * this.yRatio,
        this.distZ * t2
      );
    }
    else if (this.currentState == FlameAnimation.STATE_FLOATING) {
      if (this.posX == -1) {
        this.posX = mesh.position.x;
        this.posY = mesh.position.y;
        this.posZ = mesh.position.z;
        this.instance.setDetail(5);
      }
      mesh.position.set(
        mesh.position.x + this.randFlyX,
        mesh.position.y + 0.2,
        mesh.position.z + this.randFlyZ
      );

      let scale = mesh.scale.x + 0.003;
      mesh.scale.set(scale, scale, scale);
    }
    else if (this.currentState == FlameAnimation.STATE_IDLE) {
      if (this.posX == -1) {
        this.posX = mesh.position.x;
        this.posY = mesh.position.y;
        this.posZ = mesh.position.z;
        this.instance.setDetail(4);
      }
      mesh.position.setY(this.posY + this.currentTime / 100);

      let scale = mesh.scale.x + 0.001;
      mesh.scale.set(scale, scale, scale);
    }

    this.setColor();
    this.instance.update(deltaTime * this.animationTimeRatio);
  }

  public isDie(): boolean {
    return this.isObjDie;
  }

  public inPolling(): boolean {
    return this.isInPooling;
  }
  public setInPolling(val: boolean): void {
    this.isInPooling = val;
  }
}

export { FlameAnimation }