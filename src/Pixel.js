import diff from './diff';

class Pixel {
  static parse(type, attributes, ...children) {
    return {
      type,
      attributes: attributes || {},
      children: children.flat(Infinity)
    };
  }

  static render(vNode, $parent) {
    diff(null, null, vNode, $parent);
  }
}

export default Pixel;