varying vec2 vUv;
varying float noise;
uniform vec3 colLight;
uniform vec3 colNormal;
uniform vec3 colDark;

vec3 blend( vec3 cola, vec3 colb, float percent ) {
  return vec3(
    cola.r + (colb.r - cola.r) * percent,
    cola.g + (colb.g - cola.g) * percent,
    cola.b + (colb.b - cola.b) * percent
  );
}

void main() {

  vec3 col;
  float range = 1.0 * noise;

  if(range > .8) col = colDark;
  else if(range > .3) col = blend(colNormal, colDark, (range - .3) / .5);
  else col = blend(colLight, colNormal, range / .3);

  gl_FragColor = vec4( col, 1 );

}
