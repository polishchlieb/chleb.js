import { diff } from './v-dom.js';

export default class Bread {
    constructor({ app }) {
        this.app = app;
    }

    render(parent) {
        diff(0, { node: this.app }, parent);
    }
}