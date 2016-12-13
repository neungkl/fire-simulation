"use strict";

class Utils {
  public static hexToVec3(col: string): number[] {
    let num = parseInt(col.substr(1), 16);
    let r = (num / 256 / 256) % 256;
    let g = (num / 256) % 256;
    let b = num % 256;
    return [r / 255.0, g / 255.0, b / 255.0];
  }
}

export { Utils }