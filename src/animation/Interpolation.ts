export class Interpolation {
  public static easeOutQuint(percent, start, end) {
    let t = percent;
    t--;
    return (end - start) * (t*t*t*t*t + 1) + start;
  }

  public static easeInQuint(percent, start, end) {
    let t = percent;
	  return (end - start)*t*t*t*t*t + start;
  };

  public static easeOutSine(percent, start, end) {
    return (end - start) * Math.sin(percent * (Math.PI/2)) + start;
  };
}