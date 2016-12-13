export class Interpolation {
  public static easeOutCubic(percent, start, end) {
    let t = percent;
    t--;
    return (end - start) * (t*t*t + 1) + start;
  }

  public static easeInCubic(percent, start, end) {
    let t = percent;
	  return (end - start)*t*t*t + start;
  };

  public static easeOutSine(percent, start, end) {
    return (end - start) * Math.sin(percent * (Math.PI/2)) + start;
  };
}