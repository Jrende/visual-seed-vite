import * as glm from 'gl-matrix';

export default class Shader {
  vert: string;
  frag: string;
  attributes: string[];
  compiled: boolean;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation>;

  constructor(src: { vert: string; frag: string }) {
    this.vert = src.vert;
    this.frag = src.frag;
    this.attributes = this.getAttributes(src.vert);
  }

  getAttributes(source: string): string[] {
    return source
      .split('\n')
      .filter((row) => row.includes('attribute'))
      .map((a) => a.substring(a.lastIndexOf(' ') + 1, a.length - 1));
  }

  bind() {
    if (!this.compiled) {
      throw new Error("Can't bind uncompiled shader");
    }
    this.gl.useProgram(this.program);
  }

  compile(gl) {
    this.gl = gl;
    if (!this.compiled) {
      this.uniforms = {};
      const vertProgram = this.compileShader(
        this.gl,
        this.vert,
        gl.VERTEX_SHADER
      );
      const fragProgram = this.compileShader(
        this.gl,
        this.frag,
        gl.FRAGMENT_SHADER
      );
      this.program = this.createShaderProgram(
        this.gl,
        vertProgram,
        fragProgram
      );
      this.compiled = true;
    }
  }

  isCompiled(): boolean {
    return this.compiled;
  }

  compileShader(gl, src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        `Error when compiling shader: ${gl.getShaderInfoLog(shader)}`
      );
      console.groupCollapsed('Shader source');
      console.log(src);
      console.groupEnd();
      return null;
    }
    return shader;
  }

  createShaderProgram(gl, vertexShader, fragmentShader) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    for (let i = 0; i < this.attributes.length; i++) {
      gl.bindAttribLocation(shaderProgram, i, this.attributes[i]);
    }

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(shaderProgram);
      console.error(`Error compiling shader: \n\n${info}`);
    }
    gl.useProgram(shaderProgram);
    return shaderProgram;
  }

  getUniformHandle(uniformName: string): WebGLUniformLocation {
    if (this.uniforms[uniformName] === undefined) {
      const handle = this.gl.getUniformLocation(this.program, uniformName);
      this.uniforms[uniformName] = handle;
    }
    return this.uniforms[uniformName];
  }

  setBool(uniformName: string, value: boolean) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1i(uniformHandle, value ? 1 : 0);
  }

  setInt(uniformName: string, value: number) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1i(uniformHandle, value);
  }

  setFloat(uniformName: string, value: number) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1f(uniformHandle, value);
  }

  setVec2(uniformName: string, value: glm.vec2) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform2fv(uniformHandle, value);
  }

  setVec3(uniformName: string, value: glm.vec3) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform3fv(uniformHandle, value);
  }

  setVec4(uniformName: string, value: glm.vec4) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform4fv(uniformHandle, value);
  }

  setMat3(uniformName: string, value: glm.mat3) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniformMatrix3fv(uniformHandle, false, value);
  }

  setMat4(uniformName: string, value: glm.mat4) {
    const uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniformMatrix4fv(uniformHandle, false, value);
  }

  setSampler2D(uniformName: string, value) {
    this.setInt(uniformName, value);
  }

  unbind() {
    this.gl.useProgram(null);
  }
}
