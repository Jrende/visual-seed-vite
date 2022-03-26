import World from '../World';
export default interface Geometry {
  addToWorld(world: World, material);
}
