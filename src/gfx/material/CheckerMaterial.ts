import getShader from '../shader';
import { Color, getColor } from '../Utils';
import { BlendMode, BlendModes } from './BlendMode';
import { Material } from './Material';

export default class CheckerMaterial extends Material {
  color1: Color;
  color2: Color;
  transparent: boolean;

  constructor(
    color1,
    color2,
    private width = 16,
    private height = 16,
    options: { blendMode?: BlendMode } = {}
  ) {
    super(getShader('checker'), 'CheckerMaterial', options);

    this.color1 = getColor(color1);

    this.color2 = getColor(color2);

    this.transparent = this.color1[3] < 1.0 || this.color2[3] < 1.0;
    this.width = width;
    this.height = height;
  }

  apply() {
    this.shader.setVec4('color1', this.color1);
    this.shader.setVec4('color2', this.color2);
    this.shader.setFloat('width', this.width);
    this.shader.setFloat('height', this.height);
  }

  isTransparent() {
    return this.transparent;
  }
}
