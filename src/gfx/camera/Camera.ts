import gl from '../../context';
import * as glm from 'gl-matrix';

abstract class Camera {
  up: glm.vec3;
  pos: glm.vec3;
  dir: glm.vec3;
  viewMatrix: glm.mat4;
  projectionMatrix: glm.mat4;
  vpMatrix: glm.mat4;
  width: number;
  height: number;

  constructor() {
    this.width = gl.canvas.width;
    this.height = gl.canvas.height;
    this.viewMatrix = glm.mat4.create();
    this.projectionMatrix = glm.mat4.create();
    this.vpMatrix = glm.mat4.create();
  }

  getVPMatrix() {
    return this.vpMatrix;
  }
}

export default Camera;
