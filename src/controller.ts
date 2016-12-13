"use strict";

class Controller {

  public static DARK_COLOR: number = 0;
  public static NORMAL_COLOR: number = 1;
  public static LIGHT_COLOR: number = 2;
  public static LIGHT_COLOR_2: number = 3;
  public static DARK_COLOR_2: number = 4;
  public static RESTART: number = 5;

  private static gui;
  private static eventListener;

  private static params;

  public static init() {

    this.eventListener = [];

    let ControlParam = function() {

      this.LightColor2 = '#ff8700';
      this.LightColor = '#f7f342';
      this.NormalColor = '#f7a90e';
      this.DarkColor2 = '#342c20';
      this.DarkColor = "#110f0f";

      this.restart = function() { }
    };

    let params = new ControlParam();
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Spawn Color');
    this.eventListener[Controller.DARK_COLOR] = f1.addColor(params, 'DarkColor');
    this.eventListener[Controller.DARK_COLOR_2] = f1.addColor(params, 'DarkColor2');
    this.eventListener[Controller.NORMAL_COLOR] = f1.addColor(params, 'NormalColor');
    this.eventListener[Controller.LIGHT_COLOR] = f1.addColor(params, 'LightColor');
    this.eventListener[Controller.LIGHT_COLOR_2] = f1.addColor(params, 'LightColor2');
    f1.open();

    gui.add(params, 'restart');
    
    this.gui = gui;
    this.params = params;
  }

  public static getParams() {
    return this.params;
  }

  public static setRestartFunc(func: Function) {
    this.params.restart = func;
  }

  public static attachEvent(key, callback) {
    this.eventListener[key].onChange(callback);
  }
}

export { Controller }