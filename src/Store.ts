export default class Store {
    public state: Object;
    private listeners: Array<Function> = [];

    public constructor(defaultState: Object = {}) {
        this.state = defaultState;
    }

    public setState(state: Object): void {
        Object.assign(this.state, state);
        this.listeners.forEach(func => func());
    }

    public subscribe(func: Function): void {
        this.listeners.push(func);
    }
}