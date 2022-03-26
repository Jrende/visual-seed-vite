precision highp float;

uniform sampler2D sampler;
varying vec2 uv;

void main(void) {
  vec4 c = texture2D(sampler, uv).rgba;
  float a = c.a;
  gl_FragColor = vec4(c.r/a, c.g/a, c.b/a, a);
  //gl_FragColor = vec4(a, a, a, a);
}
