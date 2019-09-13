import Component from '../lib/Component.js';

export default class OkoNub extends Component {
    render() {
        return {
            node: 'h1',
            children: [
                this.props.noobity
            ]
        }
    }
}