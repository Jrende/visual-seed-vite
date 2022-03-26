import Shader from '../shader/Shader';
import { BlendMode, BlendModes } from './BlendMode';

export abstract class Material {
  shader: Shader;
  name: string;
  blendMode: BlendMode = BlendModes.Normal;

  constructor(
    shader: Shader,
    name: string,
    options: { blendMode?: BlendMode } = {}
  ) {
    this.shader = shader;
    this.name = name;
    this.blendMode = options?.blendMode ?? BlendModes.Normal;
  }

  isTransparent() {
    return false;
  }

  abstract apply();
}
