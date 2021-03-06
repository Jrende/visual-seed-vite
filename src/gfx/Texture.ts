import gl from '../context';
export default class Texture {
  image: any;
  src: string;
  texture: WebGLTexture;

  constructor(path: string | WebGLTexture) {
    if (typeof path === 'string') {
      this.image = new Image();
      this.src = path;
      this.compile();
    } else {
      this.texture = path;
    }
  }

  compile() {
    this.texture = gl.createTexture();
    this.image.addEventListener('load', () => {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      );
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
      console.log('Loaded ', this.src);
    });
    this.image.src = this.src;
  }

  bind(unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  unbind() {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}
