import getShader from '../shader';
import { Color, getColor } from '../Utils';
import { Material } from './Material';
import { BlendMode } from './BlendMode';

export default class CloudMaterial extends Material {
  color: Color;
  seed: number;

  constructor(color, options: { blendMode?: BlendMode } = {}) {
    super(getShader('cloud'), 'CloudMaterial', options);
    this.color = getColor(color);
    this.seed = 2;
  }

  apply() {
    this.shader.setFloat('seed', this.seed);
    this.shader.setFloat('r', this.color[0]);
    this.shader.setFloat('g', this.color[1]);
    this.shader.setFloat('b', this.color[2]);
    this.shader.setFloat('size', 1.35);
    this.shader.setFloat('density', 0.1);
    this.shader.setFloat('left', 0);
    this.shader.setFloat('up', 0);
    this.shader.setVec2('res', [2048, 2048]);
  }

  isTransparent() {
    return true;
  }
}
