import getShader from '../shader';
import Texture from '../Texture';
import { getColor } from '../Utils';
import { Material } from './Material';
import { BlendMode } from './BlendMode';
import * as glm from 'gl-matrix';

export default class GradientMaterial extends Material {
  transparent: boolean;

  constructor(
    private gradient,
    private from = [0, 0],
    private to = [1, 0],
    private repeatType = 'Repeat',
    options: { blendMode?: BlendMode } = {}
  ) {
    super(getShader('gradient'), 'GradientMaterial', options);
    this.gradient.forEach((g) => (g.color = getColor(g.color)));
    this.from = from;
    this.to = to;
    this.repeatType = repeatType;
    this.transparent = this.gradient.find((a) => a.color[3] < 1.0);
  }

  apply() {
    this.shader.bind(0);
    this.shader.setVec2('from', this.from);
    this.shader.setVec2('to', this.to);
    this.shader.setInt('size', this.gradient.length);
    this.shader.setInt('repeatType', this.repeatType);

    for (let i = 0; i < this.gradient.length; i++) {
      const g = this.gradient[i];
      this.shader.setFloat(`gradient[${i}].position`, g.position);
      this.shader.setVec4(`gradient[${i}].color`, g.color);
    }
  }

  isTransparent() {
    return this.transparent;
  }
}
