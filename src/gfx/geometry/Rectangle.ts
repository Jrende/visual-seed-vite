import Geometry from './Geometry';
import Quad from './Quad';

export default class Rectangle implements Geometry {
  pos;
  width: number;
  height: number;
  constructor(pos, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  addToWorld(world, material) {
    const child = world.createChild();
    child.material = material;
    child.geometry = (Quad as any).geometry;
    child
      .scale([this.width, this.height, 1])
      .translate([this.pos[0], this.pos[1], this.pos[2]]);
  }
}
