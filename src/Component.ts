import diff from './diff';
import VNode from './VNode';

export default class Component {
    vPrevious: VNode;
    $base: HTMLElement;
    $parent: HTMLElement;
    state: Object = {};
    props: Object = {};

    willMount(): any {}
    mounted(): any {}

    render(): VNode {
        throw new Error('render method not implemented');
    }

    setState(state: Object): void {
        Object.assign(this.state, state);
        this.renderComponent();
    }

    renderComponent(): void {
        const vNode = this.render();
        this.$base = <HTMLElement>diff(this.$base, this.vPrevious, vNode, this.$parent);
    }
}