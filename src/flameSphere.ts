"use strict";

import { AssetsManager } from "./assetsManager";

class FlameSphere {

  private mesh;
  private material;
  private start;

  constructor() {
    let glsl = AssetsManager.instance.getTexture();

    this.start = Date.now();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tExplosion: {
          type: "t",
          value: THREE.ImageUtils.loadTexture('./dist/images/explosion.png')
        },
        time: {
          type: "f",
          value: 0.0
        }
      },
      vertexShader: glsl.vertexFlameShader,
      fragmentShader: glsl.fragmentFlameShader
    });

    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10, 4),
      this.material
    );
  }

  public update() {
    this.material.uniforms['time'].value = .00025 * (Date.now() - this.start);
  }

  public getMesh() {
    return this.mesh;
  }

}

export { FlameSphere }
