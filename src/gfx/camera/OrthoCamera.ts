import * as glm from 'gl-matrix';
import Camera from './Camera';

export default class OrthoCamera extends Camera {
  constructor(pos, dir) {
    super();
    this.up = [0, 1, 0];
    this.pos = pos;
    this.dir = dir;
    // left, right, bottom, top, near, far
    glm.mat4.ortho(
      this.projectionMatrix,
      -this.width,
      this.width,
      -this.height,
      this.height,
      -1000,
      1000
    );
    glm.mat4.lookAt(this.viewMatrix, this.pos, this.dir, this.up);
    glm.mat4.multiply(this.vpMatrix, this.projectionMatrix, this.viewMatrix);
  }

  getVPMatrix() {
    return this.vpMatrix;
  }
}
