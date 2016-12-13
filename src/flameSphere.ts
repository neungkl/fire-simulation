"use strict";

import { AssetsManager } from "./assetsManager";

class FlameSphere {

  private mesh: THREE.Mesh;
  private material;
  private startTime;

  constructor(x?: number, y?: number, z?: number) {

    x = x || 0;
    y = y || 0;
    z = z || 0;

    let glsl = AssetsManager.instance.getTexture();

    this.startTime = Date.now();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tExplosion: {
          type: "t",
          value: THREE.ImageUtils.loadTexture('./dist/images/explosion.png')
        },
        time: {
          type: "f",
          value: 0.0
        },
        state: {
          type: "i",
          value: 0
        },
        seed: {
          type: 'f',
          value: Math.random() * 10
        }
      },
      vertexShader: glsl.vertexFlameShader,
      fragmentShader: glsl.fragmentFlameShader
    });
    this.material.transparent = true;

    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry( 20, 5 ),
      this.material
    );

    this.mesh.position.set(x, y, z);
  }

  public update() {
    let timeDiff = Date.now() - this.startTime;
    if(timeDiff > 500) this.material.uniforms['state'].value = 1;
    if(timeDiff > 1000) this.material.uniforms['state'].value = 2;
    this.material.uniforms['time'].value = .0005 * timeDiff;
  }

  public getMesh() {
    return this.mesh;
  }

}

export { FlameSphere }
