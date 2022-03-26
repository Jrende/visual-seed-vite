import VertexArray from '../VertexArray';
import getShader from '../shader';
import Shader from '../shader/Shader';

const quad = new VertexArray(
  [1, 1, 1, 1, -1, 1, 0, 1, -1, -1, 0, 0, 1, -1, 1, 0],
  [1, 0, 2, 2, 0, 3],
  [2, 2]
);
export default abstract class PostProcessor {
  shader: Shader;
  quad: VertexArray;
  constructor(shader) {
    this.shader = shader;
    this.quad = quad;
  }
  abstract apply(buffer);
}
