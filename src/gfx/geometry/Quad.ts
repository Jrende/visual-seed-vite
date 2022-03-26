import Geometry from './Geometry';
import VertexArray from '../VertexArray';

export default class Quad implements Geometry {
  public geometry: VertexArray;
  constructor() {
    this.geometry = new VertexArray(
      [1, 1, 1, 1, 1, -1, 1, 1, 0, 1, -1, -1, 1, 0, 0, 1, -1, 1, 1, 0],
      [1, 0, 2, 2, 0, 3],
      [3, 2]
    );
  }

  addToWorld(world, material) {
    const child = world.createChild();
    child.material = material;
    child.geometry = this.geometry;
  }
}

export const QUAD = new Quad();
