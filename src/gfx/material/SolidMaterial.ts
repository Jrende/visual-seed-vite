import getShader from '../shader';
import { Material } from './Material';
import { getColor } from '../Utils';
import { BlendMode } from './BlendMode';

export default class SolidMaterial extends Material {
  color: number[];
  constructor(color, options: { blendMode?: BlendMode } = {}) {
    super(getShader('solid'), 'SolidMaterial', options);
    this.color = getColor(color);
  }

  apply() {
    this.shader.setVec4('color', this.color);
  }

  isTransparent() {
    return this.color[3] < 1.0;
  }
}
