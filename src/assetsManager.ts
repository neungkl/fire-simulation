"use strict";

class AssetsManager {

  public static instance: AssetsManager = new AssetsManager();

  private vertexFlameShader = null;
  private fragmentFlameShader = null;

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
  }

  public getTexture() {
    return {
      vertexFlameShader: this.vertexFlameShader,
      fragmentFlameShader: this.fragmentFlameShader
    };
  }
}

export { AssetsManager };
