declare module 'chleb' {
  export interface VNode {
    type: Function | string;
    attributes: { [k: string]: any };
    children: VNode[];
  }

  export class Pixel {
    public static parse(type: string | typeof Function, attributes: Object, children: (VNode | string)[]): VNode;
    public static render(vNode: VNode | string, $parent: HTMLElement): void;
  }

  export function useState<T>(defaultValue: T): [T, (value: T) => void];
}