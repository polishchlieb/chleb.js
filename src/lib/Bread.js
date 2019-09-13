import { diff } from './vDom.js';

export default class Bread {
    constructor({ app }) {
        this.app = app;
    }

    render(parent) {
        diff(0, { node: this.app }, parent);
    }
}