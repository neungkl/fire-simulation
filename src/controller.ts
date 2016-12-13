"use strict";

class Controller {

  public static SPAWN_DARK_COLOR: number = 0;
  public static SPAWN_NORMAL_COLOR: number = 1;
  public static SPAWN_LIGHT_COLOR: number = 2;

  private static gui;
  private static eventListener;

  public static init() {

    this.eventListener = [];

    var ControlParam = function() {

      this.sLightColor = '#ede92a';
      this.sNormalColor = '#f7a90e';
      this.sDarkColor = "#000000";
    };

    var param = new ControlParam();
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Spawn Color');
    this.eventListener[Controller.SPAWN_DARK_COLOR] = f1.addColor(param, 'sDarkColor');
    this.eventListener[Controller.SPAWN_NORMAL_COLOR] = f1.addColor(param, 'sNormalColor');
    this.eventListener[Controller.SPAWN_LIGHT_COLOR] = f1.addColor(param, 'sLightColor');
    f1.open();
    
    this.gui = gui;
  }

  public static attachEvent(key, callback) {
    this.eventListener[key].onChange(callback);
  }
}

export { Controller }