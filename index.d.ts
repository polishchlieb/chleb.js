declare module 'chleb' {
    export interface Ref {
        current: HTMLElement;
    }

    export interface VNode {
        type: typeof Component | string;
        attributes: { [k: string]: any };
        children: VNode[];
    }

    export class Pixel {
        public static parse(type: string | typeof Component, attributes: Object, children: (VNode | string)[]): VNode;
        public static render(vNode: VNode | string, $parent: HTMLElement): void;
        public static createRef(): Ref;
    }

    export class Component {
        private state: { [k: string]: any };
        public props: { [k: string]: any };

        public willMount(): any;
        public mounted(): any;
        public render(): VNode;

        private setState(state: { [k: string]: any }): void;
    }

    export class Store {
        public state: { [k: string]: any };
        constructor(defaultState?: { [k: string]: any });

        setState(state: { [k: string]: any }): void;
        subscribe(func: Function): void;
    }
}