import Shader from './shader/Shader';
import gl from '../context';
import * as glm from 'gl-matrix';
import getShader from './shader';
import { Framebuffer, Doublebuffer } from './Framebuffer';
import VertexArray from './VertexArray';
import { Color, getColor } from './Utils.js';
import PostProcessor from './postprocessors/PostProcessor';
import Camera from './camera/Camera';
import World from './World';
import { BlendMode, BlendModes } from './material/BlendMode';
import { RenderObject } from './World';

class Renderer {
  height: number;
  width: number;
  presentationBuffer: Doublebuffer;
  quad: VertexArray;
  textureShader: Shader;
  clearColor: Color;
  mvp: glm.mat4;
  currentBlendMode: BlendMode = BlendModes.Normal;

  constructor() {
    const [w, h] = [gl.canvas.width, gl.canvas.height];
    this.width = w;
    this.height = h;
    this.mvp = glm.mat4.create();
    this.presentationBuffer = new Doublebuffer(w, h, false, true);

    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    this.currentBlendMode.apply();

    this.quad = new VertexArray(
      [1, 1, 1, 1, -1, 1, 0, 1, -1, -1, 0, 0, 1, -1, 1, 0],
      [1, 0, 2, 2, 0, 3],
      [2, 2]
    );
    this.textureShader = getShader('texture');
  }

  render(
    world: World,
    camera: Camera,
    options: {
      postProcessors?: PostProcessor[];
      framebuffer?: Framebuffer;
    } = {}
  ): void {
    let framebuffer: Framebuffer;
    if (options.framebuffer) {
      framebuffer = options.framebuffer;
    } else {
      framebuffer = this.presentationBuffer;
    }
    framebuffer.clear();
    const c = world.renderList;
    let nodes = c.opaque;
    if (c.transparent.length !== 0) {
      c.opaque.sort((a, b) => {
        return a.transform.getPosition()[2] - b.transform.getPosition()[2];
      });

      c.transparent.sort((a, b) => {
        return a.transform.getPosition()[2] - b.transform.getPosition()[2];
      });

      nodes = [...c.opaque, ...c.transparent];
    }

    framebuffer.bind();
    this.renderScene(nodes, camera);
    framebuffer.unbind();

    if (options.postProcessors) {
      gl.disable(gl.DEPTH_TEST);
      for (let i = 0; i < options.postProcessors.length; i++) {
        options.postProcessors[i].apply(framebuffer);
      }
      gl.enable(gl.DEPTH_TEST);
    }
  }

  renderScene(renderlist: RenderObject[], camera: Camera) {
    let prevVertexArray = null;
    let prevShader = null;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (let i = 0; i < renderlist.length; i++) {
      const node = renderlist[i];
      if (prevShader !== node.material.shader) {
        if (prevShader !== null) {
          prevShader.unbind();
        }
        prevShader = node.material.shader;
        prevShader.bind();
      }

      if (prevVertexArray !== node.vertexArray) {
        if (prevVertexArray !== null) {
          prevVertexArray.unbind();
        }
        prevVertexArray = node.vertexArray;
        node.vertexArray.bind();
      }

      if (this.currentBlendMode !== node.material.blendMode) {
        this.currentBlendMode = node.material.blendMode;
        node.material.blendMode.apply();
      }

      glm.mat4.multiply(
        this.mvp,
        camera.getVPMatrix(),
        node.transform.getMatrix()
      );

      node.material.apply();
      node.material.shader.setMat4('mvp', this.mvp);
      node.vertexArray.draw();
    }
    prevVertexArray?.unbind();
    prevShader?.unbind();
  }

  present() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    this.textureShader.bind();
    this.quad.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.presentationBuffer.back.texture);
    this.textureShader.setSampler2D('sampler', 0);
    this.quad.draw();
    this.quad.unbind();
    this.textureShader.unbind();
    gl.enable(gl.DEPTH_TEST);
  }

  setClearAlpha(alpha) {
    gl.clearColor(
      this.clearColor[0],
      this.clearColor[1],
      this.clearColor[2],
      alpha
    );
  }

  setBackgroundColor(col) {
    this.clearColor = getColor(col);
    const color = this.clearColor;
    console.log('color', color);
    //How to handle alpha???
    gl.clearColor(color[0], color[1], color[2], 1.0);
  }
}
export default Renderer;
