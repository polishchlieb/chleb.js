import { renderComponent } from './v-dom.js'

export default class Component {
	state = {};
	data = {};

	constructor(props) {
		this.props = props;
	}

	setState(state) {
		this.state = state;
		renderComponent(this);
	}

	refresh() {
		renderComponent(this);
	}
}