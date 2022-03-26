/* eslint-disable no-unused-vars */
import gl from './context';
import tinycolor from 'tinycolor2';

import Renderer from './gfx/Renderer';
import World from './gfx/World';
import { Singlebuffer, Doublebuffer } from './gfx/Framebuffer';

import Triangles from './gfx/geometry/Triangles';
import Quad from './gfx/geometry/Quad';
import Ring from './gfx/geometry/Ring';
import LineStrip from './gfx/geometry/LineStrip';
import Line from './gfx/geometry/Line';
import Circle from './gfx/geometry/Circle';
import Rectangle from './gfx/geometry/Rectangle';
import Bezier from './gfx/geometry/Bezier';

import SolidMaterial from './gfx/material/SolidMaterial';
import TextureMaterial from './gfx/material/TextureMaterial';
import CloudMaterial from './gfx/material/CloudMaterial';
import CheckerMaterial from './gfx/material/CheckerMaterial';
import GradientMaterial from './gfx/material/GradientMaterial';
import { BlendModes } from './gfx/material/BlendMode';

import { Blur } from './gfx/postprocessors/Blur';
import { RemoveRed } from './gfx/postprocessors/RemoveRed';
import { RemoveGreen } from './gfx/postprocessors/RemoveGreen';
import { RemoveBlue } from './gfx/postprocessors/RemoveBlue';

import PerspectiveCamera from './gfx/camera/PerspectiveCamera';
import OrthoCamera from './gfx/camera/OrthoCamera';

import tex1 from './assets/tex1.png';
import tex2 from './assets/tex2.png';
import tex1Alpha from './assets/tex1_alpha.png';

console.log('gl', gl);
const renderer: Renderer = new Renderer();
renderer.setBackgroundColor('#000');

const pp = [new Blur(1.2)];

const world = new World();
//world.scale(100);
/*
const circle = world
  .createChild(new Quad(), new SolidMaterial('#a12'))
  .scale(200);
  */

const w = gl.canvas.width;
const h = gl.canvas.height;

const sceneToBeShownInFBO = new World()
  .createChild(new Quad(), new SolidMaterial('#a12'))
  .scale([w, h, 1]);
sceneToBeShownInFBO
  .createChild(new Circle(), new SolidMaterial('#fff'))
  .scale([0.8, 0.8, 1])
  .translate([0, 0, 5]);
const transparentScene = new World();

transparentScene
  .createChild(
    new Quad(),
    new SolidMaterial('#a12', { blendMode: BlendModes.Subtract })
  )
  .scale([w, h, 1]);
transparentScene
  .createChild(
    new Quad(),
    new SolidMaterial('#ff0000', { blendMode: BlendModes.Subtract })
  )
  .scale([w / 4, h / 4, 1])
  .translate([0, 0, 10]);
transparentScene
  .createChild(
    new Quad(),
    new SolidMaterial('#00ff00', { blendMode: BlendModes.Subtract })
  )
  .scale([w / 4, h / 4, 1])
  .translate([0.5, 0.5, 20]);

const orthoCamera = new OrthoCamera([0, 0, 100], [0, 0, 0]);
const camera = new PerspectiveCamera([0, 0, 100], [0, 0, 0]);
const fbo = new Doublebuffer(gl.canvas.width, gl.canvas.height, false, true);
const fbo2 = new Doublebuffer(gl.canvas.width, gl.canvas.height, false, true);

renderer.render(sceneToBeShownInFBO, orthoCamera, {
  framebuffer: fbo,
});

const fboDisplayQuad = new World()
  .createChild(new Quad(), new TextureMaterial(fbo.texture))
  .scale([w, h, 0]);
const fbo2DisplayQuad = new World()
  .createChild(new Quad(), new TextureMaterial(fbo2.texture))
  .scale([w, h, 0]);
function iterate() {
  renderer.render(fboDisplayQuad, orthoCamera, {
    postProcessors: pp,
    framebuffer: fbo2,
  });
  renderer.render(fbo2DisplayQuad, orthoCamera, {
    postProcessors: pp,
    framebuffer: fbo,
  });
}
function render(time) {
  //fboDisplayQuad.rotateDeg(1, [0, 1, 0]);
  renderer.render(transparentScene, orthoCamera, {
    postProcessors: [],
  });
  /*
  renderer.render(fboDisplayQuad, orthoCamera, {
    postProcessors: [],
  });
  */
  renderer.present();
  window.requestAnimationFrame(render);
}
render(0);
