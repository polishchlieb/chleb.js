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
        protected state: { [k: string]: any };
        public props: { [k: string]: any };

        public willMount(): any;
        public mounted(): any;
        public render(): VNode;

        protected setState(state: { [k: string]: any }): void;
        protected renderComponent(): void;
    }

    export class Store {
        public state: { [k: string]: any };
        public constructor(defaultState?: { [k: string]: any });

        public setState(state: { [k: string]: any }): void;
        public subscribe(func: Function): void;
    }
}