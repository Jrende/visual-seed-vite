import gl from 'context';
import Geometry from './Geometry';
import VertexArray from '../VertexArray';
import World from 'gfx/World';

const ringCache = {};
function getRing(numPoints, innerRadius) {
  const key = numPoints + '' + innerRadius;
  if (ringCache[key] === undefined) {
    const ringGeo = generateGeometry(numPoints, innerRadius);
    ringCache[key] = ringGeo;
  }
  return ringCache[key];
}

function generateGeometry(numPoints, innerRadius) {
  const points = [0, 0, 0];
  const indices = [];
  for (let i = 0; i < (numPoints + 1) * 2; i++) {
    const rad = (Math.PI / numPoints) * i;
    const justify = [
      ((1.0 - innerRadius) / 2) * Math.sin(rad),
      ((1.0 - innerRadius) / 2) * Math.cos(rad),
    ];

    if (i % 2 === 0) {
      points.push(Math.sin(rad) + justify[0]);
      points.push(Math.cos(rad) + justify[1]);
    } else {
      points.push(Math.sin(rad) * innerRadius + justify[0]);
      points.push(Math.cos(rad) * innerRadius + justify[1]);
    }
    points.push(0);
  }

  for (let i = 0; i < numPoints; i++) {
    [3, 2, 1, 3, 4, 2].map((n) => n + i * 2).forEach((n) => indices.push(n));
  }
  return new VertexArray(points, indices, [3], gl.TRIANGLES);
}

export default class Ring implements Geometry {
  points: number;
  innerRadius: number;
  vertexArray: VertexArray;

  constructor(points = 6, innerRadius = 0.5) {
    this.points = points;
    this.vertexArray = getRing(points, innerRadius);
  }

  addToWorld(world: World, material) {
    const child = world.createChild();
    child.material = material;
    child.geometry = this.vertexArray;
  }
}
