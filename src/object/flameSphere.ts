"use strict";

import { AssetsManager } from "../assetsManager";
import { Controller } from "../controller";
import { Utils } from "../utils";

class FlameSphere {

  private mesh: THREE.Mesh;
  private flowRatio: number = 1;
  private material;
  
  private static defaultColor = {
    colDark: '#000000',
    colNormal: '#f7a90e',
    colLight: '#ede92a'
  };

  constructor(radius?: number) {

    radius = radius || 20;

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
          value: Math.random() * 3.5 + 5
        },
        opacity: {
          type: 'f',
          value: 0.95
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
      new THREE.IcosahedronGeometry( radius, 3 ),
      this.material
    );

    this.mesh.position.set(0, 0, 0);
  }

  public setColor(prop) {
    if(prop.colDark != null) {
      if(typeof prop.colDark === 'string') {
        this.material.uniforms['colDark'].value = Utils.hexToVec3(prop.colDark);
      } else {
        this.material.uniforms['colDark'].value = prop.colDark;
      }
    }
    if(prop.colNormal != null) {
      if(typeof prop.colNormal === 'string') {
        this.material.uniforms['colNormal'].value = Utils.hexToVec3(prop.colNormal);
      } else {
        this.material.uniforms['colNormal'].value = prop.colNormal;
      }
    }
    if(prop.colLight != null) {
      if(typeof prop.colLight === 'string') {
        this.material.uniforms['colLight'].value = Utils.hexToVec3(prop.colLight);
      } else {
        this.material.uniforms['colLight'].value = prop.colLight;
      }
    }
  }

  public setOpacity(value: number) {
    this.material.uniforms['opacity'].value = value;
  }

  public setDetail(value: number) {
    this.material.uniforms['detail'].value = value;
  }

  public update(timeDiff: number): void {
    this.material.uniforms['time'].value += .0005 * timeDiff * this.flowRatio;
  }

  public setFlowRatio(val: number): void {
    this.flowRatio = val;
  }

  public getMesh() {
    return this.mesh;
  }

}

export { FlameSphere }
