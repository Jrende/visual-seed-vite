attribute vec3 aVertexPosition;
attribute vec2 TexCoord;

varying vec2 uv;
uniform mat4 mvp;
void main(void) {
  uv = TexCoord;
  vec4 pos = mvp * vec4(aVertexPosition, 1.0);
  gl_Position = pos;
}
