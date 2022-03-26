import gl from '../../context';

export interface BlendMode {
  apply();
}

class BlendModeImpl implements BlendMode {
  constructor(private src: number, private dst: number, private func: number) {}

  apply() {
    console.log('apply');
    gl.blendFunc(this.src, this.dst);
    gl.blendEquation(this.func);
  }
}

export const BlendModes = {
  Normal: new BlendModeImpl(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD),
  Multiply: new BlendModeImpl(gl.ONE, gl.ONE, gl.FUNC_ADD),
  Subtract: new BlendModeImpl(gl.SRC_COLOR, gl.DST_COLOR, gl.FUNC_ADD),
  Additive: new BlendModeImpl(gl.SRC_COLOR, gl.DST_COLOR, gl.FUNC_ADD),
  Divide: new BlendModeImpl(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD),
};
