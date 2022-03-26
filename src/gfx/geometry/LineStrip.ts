import Geometry from './Geometry';
import { vec3 } from 'gl-matrix';
import Line from './Line';
import VertexArray from '../VertexArray';

function getJoinTriangle(line, vec, cross, width) {
  const midpoint = [
    line.to[0] + line.from[0],
    line.to[1] + line.from[1],
    line.to[2] + line.from[2],
  ].map((item) => item / 2.0);

  const direction = vec3.subtract(
    vec3.create(),
    line.to,
    Float32Array.from(midpoint)
  );
  vec3.normalize(direction, direction);

  const normal = vec3.cross(vec3.create(), direction, [0, 0, -cross[2]]);
  vec3.normalize(normal, normal);
  vec3.scale(normal, normal, width);
  vec3.add(vec, vec, normal);
  return vec;
}

export default class LineStrip implements Geometry {
  lines: any[];
  width: number;
  constructor(lines, width = 5) {
    this.lines = [];
    this.width = width;
    for (let i = 0; i < lines.length - 1; i++) {
      this.lines.push(new Line(lines[i], lines[i + 1], width));
    }
  }

  getJoins() {
    const joins = [];
    for (let i = 0; i < this.lines.length - 1; i++) {
      const joinTriangle = [];
      const line1 = this.lines[i];
      const line2 = this.lines[i + 1];
      const v1 = vec3.subtract(vec3.create(), line1.to, line1.from);
      const v2 = vec3.subtract(vec3.create(), line2.from, line2.to);
      const cross = vec3.cross(vec3.create(), v1, v2);
      vec3.normalize(cross, cross);

      joinTriangle.push(
        getJoinTriangle(line1, vec3.clone(line1.to), cross, this.width)
      );
      joinTriangle.push(
        getJoinTriangle(line2, vec3.clone(line2.from), cross, this.width)
      );
      joinTriangle.push(line1.to);

      joins.push(joinTriangle);
    }
    return joins;
  }

  addToWorld(world, material) {
    this.lines.forEach((line) => world.createChild(line, material));
    this.getJoins().forEach((join) => {
      const arr = join.reduce((acc, val) => {
        val.forEach((v) => acc.push(v));
        return acc;
      }, []);
      const vertexArray = new VertexArray(arr, [0, 1, 2], [3]);
      const child = world.createChild();
      child.material = material;
      child.geometry = vertexArray;
    });
  }
}
