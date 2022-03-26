import Geometry from './Geometry';
import VertexArray from '../VertexArray';

export default class Triangles implements Geometry {
  constructor(points) {
    const vertices = [];
    const indices = [];
    for (let i = 0; i < points.length; i++) {
      points[i].forEach((p) => vertices.push(p));
      indices.push(i);
    }
    this.geometry = new VertexArray(vertices, indices, [3], gl.TRIANGLES);
  }

  addToWorld(world: Geometry, material) {
    const child = world.createChild();
    child.material = material;
    child.geometry = this.geometry;
  }
}
