import gl from '../../context';

import solidFrag from './glsl/solid.frag?raw';
import textureMaterialShaderFrag from './glsl/textureMaterialShader.frag?raw';
import textureShaderFrag from './glsl/textureShader.frag?raw';
import blurFrag from './glsl/blur.frag?raw';
import cloudFrag from './glsl/cloud.frag?raw';
import checkerFrag from './glsl/checkers.frag?raw';
import gradientFrag from './glsl/megaGradient.frag?raw';
import removeRed from './glsl/removeRed.frag?raw';
import removeGreen from './glsl/removeGreen.frag?raw';
import removeBlue from './glsl/removeBlue.frag?raw';

import genUv2D from './glsl/genUv2D.vert?raw';
import postprocess from './glsl/postprocess.vert?raw';
import material from './glsl/material.vert?raw';

import Shader from './Shader';

const shaders = {
  solid: new Shader({
    frag: solidFrag,
    vert: material,
  }),
  textureMaterial: new Shader({
    frag: textureMaterialShaderFrag,
    vert: material,
  }),
  cloud: new Shader({
    frag: cloudFrag,
    vert: material,
  }),
  checker: new Shader({
    frag: checkerFrag,
    vert: material,
  }),
  gradient: new Shader({
    frag: gradientFrag,
    vert: material,
  }),

  blur: new Shader({
    frag: blurFrag,
    vert: postprocess,
  }),
  removeBlue: new Shader({
    frag: removeBlue,
    vert: postprocess,
  }),
  removeGreen: new Shader({
    frag: removeGreen,
    vert: postprocess,
  }),
  removeRed: new Shader({
    frag: removeRed,
    vert: postprocess,
  }),

  texture: new Shader({
    frag: textureShaderFrag,
    vert: genUv2D,
  }),
};

function getShader(name) {
  const shader = shaders[name];
  if (!shader.isCompiled()) {
    shader.compile(gl);
  }
  if (shader === undefined) {
    throw new Error(`Unable to get shader ${name}`);
  }
  return shader;
}

export default getShader;
