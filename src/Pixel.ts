import diff from './diff';
import VNodeObject from './VNode';
import Component from './Component';

interface Ref {
    current: HTMLElement;
}

export default class Pixel {
    public static parse(type: string | typeof Component, attributes: Object, ...children: (VNodeObject | string)[]): VNodeObject {
        return {
            type,
            attributes: attributes || {},
            children: children.flat(Infinity)
        };
    }

    public static render(vNode: VNodeObject | string, $parent: HTMLElement): void {
        diff(null, null, vNode, $parent);
    }

    public static createRef(): Ref {
        return { current: null };
    }
}