"use strict";

class AssetsManager {

  public static instance: AssetsManager = new AssetsManager();

  private vertexFlameShader = null;
  private fragmentFlameShader = null;
  private vertexParticleShader = null;
  private fragmentParticleShader = null;

  constructor() {
    $.ajax({
      url: './dist/shader/vertexFlameShader.glsl',
      async: false,
      success: (vs) => {
        this.vertexFlameShader = vs;
      }
    });

    $.ajax({
      url: './dist/shader/fragmentFlameShader.glsl',
      async: false,
      success: (fs) => {
        this.fragmentFlameShader = fs;
      }
    });
    
    $.ajax({
      url: './dist/shader/vertexParticleShader.glsl',
      async: false,
      success: (fs) => {
        this.vertexParticleShader = fs;
      }
    });

    $.ajax({
      url: './dist/shader/fragmentParticleShader.glsl',
      async: false,
      success: (fs) => {
        this.fragmentParticleShader = fs;
      }
    });
  }

  public getTexture() {
    return {
      vertexFlameShader: this.vertexFlameShader,
      fragmentFlameShader: this.fragmentFlameShader,
      vectexParticleShader: this.vertexParticleShader,
      fragmentParticleShader: this.fragmentParticleShader
    };
  }
}

export { AssetsManager };
