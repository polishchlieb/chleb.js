export default class Store {
    state: Object;
    listeners: Array<Function> = [];

    constructor(defaultState: Object = {}) {
        this.state = defaultState;
    }

    setState(state: Object): void {
        Object.assign(this.state, state);
        this.listeners.forEach(func => func());
    }

    subscribe(func: Function): void {
        this.listeners.push(func);
    }
}