import gl from '../context';

export interface Framebuffer {
  texture: WebGLTexture;
  bind();
  unbind();
  clear();
  renderTo(renderCmd);
}

export class Singlebuffer implements Framebuffer {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
  depth: WebGLRenderbuffer;
  stencilBuffer: WebGLRenderbuffer;
  clearBits: number;

  constructor(
    private width?: number,
    private height?: number,
    withStencil = false,
    withDepth = false
  ) {
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    if (!height) {
      height = gl.canvas.height;
    }
    if (!width) {
      width = gl.canvas.width;
    }

    this.texture = this.initTexture(gl.RGBA, gl.COLOR_ATTACHMENT0);
    this.clearBits = gl.COLOR_BUFFER_BIT;

    if (withDepth) {
      this.depth = this.initRenderBuffer(
        gl.DEPTH_COMPONENT16,
        gl.DEPTH_ATTACHMENT
      );
      this.clearBits |= gl.DEPTH_BUFFER_BIT;
    }

    if (withStencil) {
      this.stencilBuffer = this.initRenderBuffer(
        gl.STENCIL_INDEX8,
        gl.STENCIL_ATTACHMENT
      );
      this.clearBits |= gl.STENCIL_BUFFER_BIT;
    }
    gl.viewport(0, 0, width, height);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('Error creating framebuffer, got status', status);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.framebuffer = framebuffer;
  }

  private initRenderBuffer(component, attachment) {
    const renderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, component, this.width, this.height);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      attachment,
      gl.RENDERBUFFER,
      renderBuffer
    );
    return renderBuffer;
  }

  private initTexture(format, attachment): WebGLTexture {
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format,
      this.width,
      this.height,
      0,
      format,
      gl.UNSIGNED_BYTE,
      null
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      attachment,
      gl.TEXTURE_2D,
      texture,
      0
    );

    return texture;
  }

  bind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0
    );
  }

  unbind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  clear() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.clear(this.clearBits);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  renderTo(renderCmd) {
    this.bind();
    renderCmd();
    this.unbind();
    return this;
  }
}

export class Doublebuffer implements Framebuffer {
  state: boolean;
  front: Singlebuffer;
  back: Singlebuffer;
  clearBits: number;

  constructor(width, height, withStencil = false, withDepth = false) {
    this.state = false;
    this.front = new Singlebuffer(width, height, withStencil, withDepth);
    this.back = new Singlebuffer(width, height, withStencil, withDepth);
    this.clearBits = gl.COLOR_BUFFER_BIT;
    if (withDepth) {
      this.clearBits |= gl.DEPTH_BUFFER_BIT;
    }
  }

  bind() {
    this.front.bind();
  }

  unbind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.flip();
  }

  flip() {
    const temp = this.front;
    this.front = this.back;
    this.back = temp;
    this.state = !this.state;
  }

  get texture() {
    return this.back.texture;
  }

  renderTo(renderCmd) {
    this.bind();
    renderCmd();
    this.unbind();
    return this;
  }

  clear() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.front.framebuffer);
    gl.clear(this.clearBits);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.back.framebuffer);
    gl.clear(this.clearBits);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
