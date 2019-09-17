import Component from '../lib/Component.js'

export default class App extends Component {
    data = {
        text: ''
    };

    render() {
        return {
            node: 'div',
            attributes: { class: 'app' },
            children: [
                {
                    node: 'div',
                    children: [
                        {
                            node: 'input',
                            attributes: { type: 'text' },
                            events: [
                                {
                                    name: 'input',
                                    callback: e => this.update(e)
                                }
                            ],
                            children: []
                        }
                    ]
                },
                {
                    node: 'h1',
                    children: [ this.text ]
                }
            ]
        };
    }

    update(e) {
        this.text = e.target.value;
    }
}