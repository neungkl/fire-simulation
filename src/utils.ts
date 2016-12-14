"use strict";

class Utils {
  public static hexToVec3(col: string): number[] {
    let num = parseInt(col.substr(1), 16);
    let r = (num / 256 / 256) % 256;
    let g = (num / 256) % 256;
    let b = num % 256;
    return [r / 255.0, g / 255.0, b / 255.0];
  }

  public static formatZero(val: string) {
    if (val.length == 1) return '0' + val;
    return val;
  }

  public static vec3ToHex(col: number[]): string {
    return '#' +
      this.formatZero(col[0].toString(16)) +
      this.formatZero(col[1].toString(16)) +
      this.formatZero(col[2].toString(16));
  }

  public static vec3Blend(cola: string, colb: string, t: number) {
    let a = this.hexToVec3(cola);
    let b = this.hexToVec3(colb);
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t
    ];
  }
}

export { Utils }