import getShader from '../shader';
import Texture from '../Texture';
import { Material } from './Material';
import { BlendMode } from './BlendMode';

export default class TextureMaterial extends Material {
  texture: Texture;
  constructor(
    texturePath: string | WebGLTexture,
    options: { blendMode?: BlendMode } = {}
  ) {
    super(getShader('textureMaterial'), 'TextureMaterial', options);
    this.texture = new Texture(texturePath);
  }

  apply() {
    this.texture.bind(0);
    this.shader.setSampler2D('sampler', 0);
  }

  isTransparent() {
    return true;
  }
}
