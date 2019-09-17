import { renderComponent } from './vDom.js'

export default class Component {
	data = {};

	constructor(props) {
		this.props = props;
	}

	refresh() {
		renderComponent(this);
	}
}