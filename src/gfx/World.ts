import Geometry from 'gfx/geometry/Geometry';
import * as glm from 'gl-matrix';
import Transform from './Transform';
import SolidMaterial from './material/SolidMaterial';
import { degToRad } from './Utils';
import { Material } from './material/Material';
import VertexArray from './VertexArray';

export interface RenderObject {
  vertexArray: VertexArray;
  material: Material;
  transform: Transform;
}

export interface RenderList {
  opaque: RenderObject[];
  transparent: RenderObject[];
}

export default class World {
  transformValue = new Transform();
  effectiveTransform = new Transform();
  children: World[] = [];
  parent = null;
  geometry: Geometry;
  material: Material;
  renderList: RenderList;

  constructor(
    geometry = undefined,
    renderList = { opaque: [], transparent: [] }
  ) {
    this.geometry = geometry;
    this.renderList = renderList;
  }

  createChild(
    geometry?: Geometry,
    material: Material = new SolidMaterial([1.0, 1.0, 1.0])
  ): World {
    const newWorld = new World(undefined, this.renderList);
    newWorld.parent = this;
    if (geometry !== undefined) {
      geometry.addToWorld(newWorld, material);
      //Won't work with moving camera, would need to update every frame
      const newDrawObjs = newWorld.getChildren();
      newDrawObjs.opaque.forEach((node) => this.renderList.opaque.push(node));
      newDrawObjs.transparent.forEach((node) =>
        this.renderList.transparent.push(node)
      );
    }
    this.children.push(newWorld);
    newWorld.update();
    return newWorld;
  }

  getPosition() {
    return this.effectiveTransform.pos;
  }

  identity() {
    this.transformValue.identity();
    this.update();
    return this;
  }

  setPosition(vec3: glm.vec3) {
    this.transformValue.setPosition(vec3);
    this.update();
    return this;
  }

  translate(vec3: glm.vec3) {
    this.transformValue.translate(vec3);
    this.update();
    return this;
  }

  scale(vec3: number | glm.vec3) {
    if (!isNaN(vec3 as number)) {
      const num = vec3 as number;
      vec3 = [num, num, num];
    }
    this.transformValue.scale(vec3 as glm.vec3);
    this.update();
    return this;
  }

  rotateDeg(angle: number, axis: glm.vec3 = [0, 0, 1]) {
    this.transformValue.rotate(degToRad(angle), axis);
    this.update();
    return this;
  }

  rotate(angle: number, axis: glm.vec3 = [0, 0, 1]) {
    this.transformValue.rotate(angle, axis);
    this.update();
    return this;
  }

  transform(mat: glm.mat4) {
    this.transformValue.transform(mat);
    this.update();
    return this;
  }

  update() {
    let parentTransform = null;
    if (this.parent == null) {
      parentTransform = {
        mat: glm.mat4.create(),
      };
    } else {
      parentTransform = this.parent.effectiveTransform;
    }

    glm.mat4.mul(
      this.effectiveTransform.mat,
      parentTransform.mat,
      this.transformValue.mat
    );
    this.children.forEach((child) => child.update());
    //this.children.forEach((child) => child.update(this.effectiveTransform));
  }

  getChildren(opaque = [], transparent = []) {
    this.children.forEach((node) => {
      node.getChildren(opaque, transparent);
      if (node.geometry != null) {
        const obj = {
          vertexArray: node.geometry,
          material: node.material,
          transform: node.effectiveTransform,
        };
        if (node.material.isTransparent()) {
          transparent.push(obj);
        } else {
          opaque.push(obj);
        }
      }
    });
    return { opaque, transparent };
  }
}
