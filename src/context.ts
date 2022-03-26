const canvas = document.querySelector('canvas');
const context = canvas.getContext('webgl2', {
  antialias: false,
  depth: true,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  alpha: true,
}) as WebGL2RenderingContext;
if (context == null) {
  console.error('Unable to create WebGL 2.0 context');
}
export default context;
