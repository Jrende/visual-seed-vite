import Geometry from './Geometry';
import { QUAD } from './Quad';

export default class Line implements Geometry {
  from;
  to;
  width: number;

  constructor(from, to, width = 5) {
    this.from = from;
    this.to = to;
    this.width = width;
    if (this.from.length === 2) {
      this.from[2] = 0.0;
    }
    if (this.to.length === 2) {
      this.to[2] = 0.0;
    }
  }

  addToWorld(world, material) {
    const midpoint = [
      (this.to[0] + this.from[0]) / 2.0,
      (this.to[1] + this.from[1]) / 2.0,
      (this.to[2] + this.from[2]) / 2.0,
    ];
    const p = [
      this.to[0] - this.from[0],
      this.to[1] - this.from[1],
      this.to[2] - this.from[2],
    ];
    const len = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    const angle = -Math.atan(p[0] / p[1]);

    const child = world.createChild();
    child.material = material;
    child.geometry = QUAD.geometry;
    child.translate(midpoint);
    child.rotate(angle, [0, 0, 1]);
    child.scale([this.width, len / 2.0, 1]);
  }
}
