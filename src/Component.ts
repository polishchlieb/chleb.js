import diff from './diff';
import VNode from './VNode';

export default class Component {
    public vPrevious: VNode;
    public $base: HTMLElement;
    public $parent: HTMLElement;
    private state: Object = {};
    public props: Object = {};

    public willMount(): any {}
    public mounted(): any {}
    public willUnmount(): any {}

    public render(): VNode {
        throw new Error('render method not implemented');
    }

    protected setState(state: Object): void {
        Object.assign(this.state, state);
        this.renderComponent();
    }

    protected renderComponent(): void {
        this.$base = <HTMLElement>diff(
            this.$base,
            this.vPrevious,
            this.vPrevious = this.render(),
            this.$parent
        );
    }
}