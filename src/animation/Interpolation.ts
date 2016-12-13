export class Interpolation {
  public static easeOutQuint(percent, start, end) {
    let t = percent;
    t--;
    return (end - start) * (t*t*t*t*t + 1) + start;
  }
}