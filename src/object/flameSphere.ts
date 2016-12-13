"use strict";

import { AssetsManager } from "../assetsManager";
import { Controller } from "../controller";
import { Utils } from "../utils";

class FlameSphere {

  private mesh: THREE.Mesh;
  private material;

  private curTime: number;
  
  private static defaultColor = {
    colDark: '#000000',
    colNormal: '#f7a90e',
    colLight: '#ede92a'
  };

  constructor(x?: number, y?: number, z?: number) {

    x = x || 0;
    y = y || 0;
    z = z || 0;

    this.curTime = 0;

    let glsl = AssetsManager.instance.getTexture();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: "f",
          value: 0.0
        },
        seed: {
          type: 'f',
          value: Math.random() * 10
        },
        colLight: {
          value: Utils.hexToVec3(FlameSphere.defaultColor.colLight)
        },
        colNormal: {
          value: Utils.hexToVec3(FlameSphere.defaultColor.colNormal)
        },
        colDark: {
          value: Utils.hexToVec3(FlameSphere.defaultColor.colDark)
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

  public setColor(prop) {
    if(prop.colDark != null) {
      this.material.uniforms['colDark'].value = Utils.hexToVec3(prop.colDark);
    }
    if(prop.colNormal != null) {
      this.material.uniforms['colNormal'].value = Utils.hexToVec3(prop.colNormal);
    }
    if(prop.colLight != null) {
      this.material.uniforms['colLight'].value = Utils.hexToVec3(prop.colLight);
    }
  }

  public update(timeDiff: number): void {
    this.curTime += timeDiff;
    this.material.uniforms['time'].value = .0005 * this.curTime;
  }

  public getMesh() {
    return this.mesh;
  }

}

export { FlameSphere }
