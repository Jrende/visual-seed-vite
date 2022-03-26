import Geometry from './Geometry';
import VertexArray from '../VertexArray';

function getDetailPoints(from, to, iteration, points = []) {
  if (iteration <= 0) {
    //move point by normal
    const newPoint = [0, 0, 0];
    points.push(newPoint);
  } else {
    const mid = [to[0] + from[0], to[1] + from[1], to[2] + from[2]].map(
      (i) => i / 2.0
    );
    getDetailPoints(from, mid, iteration - 1, points);
    getDetailPoints(mid, to, iteration - 1, points);
  }
  return points;
}

export default class Blot implements Geometry {
  vertexArray: VertexArray;
  geometry: any;

  constructor(points, detail) {
    //call getDetailPoints with points
    this.geometry = [];
    for (let i = 0; i < points.length; i++) {
      const arr = getDetailPoints(
        points[i],
        points[(i + 1) % points.length],
        detail
      );
      arr.forEach((v) => this.geometry.push(v));
    }
    this.vertexArray = new VertexArray();
  }

  addToWorld(world, material) {
    world.material = material;
    world.geometry = this.geometry;
  }
}
