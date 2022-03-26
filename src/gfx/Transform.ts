import * as glm from 'gl-matrix';

export default class Transform {
  mat: glm.mat4;
  pos: glm.vec3;
  rot: glm.quat;
  scaleValue: glm.vec3;

  constructor() {
    this.mat = glm.mat4.create();
    this.pos = [0, 0, 0];
    this.scaleValue = [1, 1, 1];
    this.rot = glm.quat.create();
  }

  identity() {
    this.mat = glm.mat4.create();
  }

  setPosition(pos: glm.vec3) {
    this.pos = pos;
    if (this.pos[2] === undefined) {
      this.pos[2] = 0;
    }
    this.calculateModelMatrix();
  }

  getPosition() {
    return [this.mat[12], this.mat[13], this.mat[14]];
  }

  //How does this interact with changing matrices from World?
  translate(vec3: glm.vec3) {
    this.pos[0] += vec3[0];
    this.pos[1] += vec3[1];
    if (vec3[2] !== undefined) {
      this.pos[2] += vec3[2];
    }
    this.calculateModelMatrix();
  }

  setScale(scale: glm.vec3) {
    this.scaleValue = scale;
    if (this.scaleValue[2] === undefined) {
      this.scaleValue[2] = 1;
    }
    this.calculateModelMatrix();
  }

  scale(vec3: glm.vec3) {
    this.scaleValue[0] *= vec3[0];
    this.scaleValue[1] *= vec3[1];
    if (vec3[2] !== undefined) {
      this.scaleValue[2] *= vec3[2];
    }
    this.calculateModelMatrix();
  }

  rotate(angle, axis: glm.vec3) {
    const newRot = glm.quat.create();
    glm.quat.setAxisAngle(newRot, axis, angle);
    glm.quat.multiply(this.rot, this.rot, newRot);
    this.calculateModelMatrix();
  }

  setRotationQuat(quat: glm.quat) {
    this.rot = quat;
    this.calculateModelMatrix();
  }

  transform(mat: glm.mat4) {
    glm.mat4.mul(this.mat, mat, this.mat);
  }

  getMatrix() {
    return this.mat;
  }

  calculateModelMatrix() {
    glm.mat4.identity(this.mat);
    const rotMat = glm.mat4.fromQuat(glm.mat4.create(), this.rot);
    glm.mat4.mul(this.mat, this.mat, rotMat);
    glm.mat4.scale(this.mat, this.mat, this.scaleValue);
    glm.mat4.translate(this.mat, this.mat, this.pos);
  }
}
