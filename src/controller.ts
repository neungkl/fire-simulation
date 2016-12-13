"use strict";

class Controller {

  public static SPAWN_DARK_COLOR: number = 0;
  public static SPAWN_NORMAL_COLOR: number = 1;
  public static SPAWN_LIGHT_COLOR: number = 2;
  public static RESTART: number = 3;

  private static gui;
  private static eventListener;

  private static params;

  public static init() {

    this.eventListener = [];

    let ControlParam = function() {

      this.sLightColor = '#ede92a';
      this.sNormalColor = '#f7a90e';
      this.sDarkColor = "#000000";

      this.restart = function() { }
    };

    let params = new ControlParam();
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Spawn Color');
    this.eventListener[Controller.SPAWN_DARK_COLOR] = f1.addColor(params, 'sDarkColor');
    this.eventListener[Controller.SPAWN_NORMAL_COLOR] = f1.addColor(params, 'sNormalColor');
    this.eventListener[Controller.SPAWN_LIGHT_COLOR] = f1.addColor(params, 'sLightColor');
    f1.open();

    gui.add(params, 'restart');
    
    this.gui = gui;
    this.params = params;
  }

  public static setRestartFunc(func: Function) {
    this.params.restart = func;
  }

  public static attachEvent(key, callback) {
    this.eventListener[key].onChange(callback);
  }
}

export { Controller }