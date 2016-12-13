varying vec2 vUv;
varying float noise;
uniform sampler2D tExplosion;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

vec3 blend( vec3 cola, vec3 colb, float percent ) {
  return vec3(
    cola.r + (colb.r - cola.r) * percent,
    cola.g + (colb.g - cola.g) * percent,
    cola.b + (colb.b - cola.b) * percent
  );
}

void main() {

  vec3 colLight = vec3(1., 1., .5);
  vec3 colMedium = vec3(1., .6, 0);
  vec3 colDark = vec3(0,0,0);

  vec3 col;

  float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
  r = 0.0;
  vec2 tPos = vec2( 0, 1.0 - 1.3 * noise + r );
  vec4 color = texture2D( tExplosion, tPos );

  float range = 1.0 * noise;

  if(range > .75) col = colDark;
  else if(range > .3) col = blend(colMedium, colDark, (range - .3) / .45);
  else col = blend(colLight, colMedium, range / .3);

  gl_FragColor = vec4( col, 1.0 );

}
