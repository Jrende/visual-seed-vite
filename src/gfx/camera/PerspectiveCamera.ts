import * as glm from 'gl-matrix';
import Camera from './Camera';

export default class PerspectiveCamera extends Camera {
  constructor(pos, dir) {
    super();
    this.up = [0, 1, 0];
    this.pos = pos;
    this.dir = dir;
    glm.mat4.perspective(
      this.projectionMatrix,
      1,
      this.height / this.width,
      0.1,
      1000
    );
    glm.mat4.lookAt(this.viewMatrix, this.pos, this.dir, this.up);
    glm.mat4.multiply(this.vpMatrix, this.projectionMatrix, this.viewMatrix);
  }

  getVPMatrix() {
    return this.vpMatrix;
  }
}
