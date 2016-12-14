"use strict";

class Controller {

  public static DARK_COLOR: number = 0;
  public static NORMAL_COLOR: number = 1;
  public static LIGHT_COLOR: number = 2;
  public static LIGHT_COLOR_2: number = 3;
  public static DARK_COLOR_2: number = 4;
  public static RESTART: number = 5;
  public static TIME_SCALE: number = 6;
  public static PARTICLE_SPREAD: number = 7;
  public static PARTICLE_COLOR: number = 8;
  public static INVERTED_BACKGROUND: number = 9;

  private static gui;
  private static eventListener;

  private static params;

  public static init() {

    this.eventListener = [];

    let ControlParam = function() {

      this.LightColor2 = '#ff8700';
      this.LightColor = '#f7f342';
      this.NormalColor = '#f7a90e';
      this.DarkColor2 = '#ff9800';
      this.GreyColor = '#3c342f';
      this.DarkColor = "#181818";

      this.TimeScale = 3;

      this.ParticleSpread = 1;
      this.ParticleColor = '#ffb400';

      this.InvertedBackground = false;

      this.restart = function() { }
    };

    let params = new ControlParam();
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Spawn Color');
    this.eventListener[Controller.DARK_COLOR] = f1.addColor(params, 'DarkColor');
    this.eventListener[Controller.DARK_COLOR_2] = f1.addColor(params, 'GreyColor');
    this.eventListener[Controller.DARK_COLOR_2] = f1.addColor(params, 'DarkColor2');
    this.eventListener[Controller.NORMAL_COLOR] = f1.addColor(params, 'NormalColor');
    this.eventListener[Controller.LIGHT_COLOR] = f1.addColor(params, 'LightColor');
    this.eventListener[Controller.LIGHT_COLOR_2] = f1.addColor(params, 'LightColor2');
    f1.open();

    var f2 = gui.addFolder('Flare Particle')
    this.eventListener[Controller.PARTICLE_SPREAD] = f2.add(params, 'ParticleSpread', 0, 2);
    this.eventListener[Controller.PARTICLE_COLOR] = f2.addColor(params, 'ParticleColor');
    f2.open();

    this.eventListener[Controller.TIME_SCALE] = gui.add(params, 'TimeScale', 0, 10);
    this.eventListener[Controller.INVERTED_BACKGROUND] = gui.add(params, 'InvertedBackground');
    
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