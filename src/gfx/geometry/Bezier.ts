import World from '../World';
import Geometry from './Geometry';
import * as Bezierjs from 'bezier-js';
import LineStrip from './LineStrip';

export default class Bezier implements Geometry {
  coords;
  steps;
  width;
  lineStrip: Geometry;

  constructor(coords, steps = 100, width = 5) {
    this.coords = coords;
    this.steps = steps;
    this.width = width;

    const bez = new Bezierjs(...coords);
    const points = bez.getLUT(steps);
    const lines = points.map((p) => [p.x, p.y]);

    this.lineStrip = new LineStrip(lines, width);
  }

  addToWorld(world: World, material) {
    world.createChild(this.lineStrip, material);
  }
}
