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

  constructor(radius?: number) {

    radius = radius || 20;
    
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
          value: Math.random() * 1000.0
        },
        detail: {
          type: 'f',
          value: Math.random() * 0.3 + 0.5
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
    // this.material.transparent = true;

    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry( radius, 4 ),
      this.material
    );

    this.mesh.position.set(0, 0, 0);
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

  public setDetail(value: number) {
    this.material.uniforms['detail'].value = value;
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
