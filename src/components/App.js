import Component from '../lib/Component.js'

export default class App extends Component {
    data = {
        content: 'oko nub'
    };

    render() {
        return {
            node: 'div',
            attributes: { class: 'app' },
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
                },
                {
                    node: 'div',
                    children: [
                        this.content
                    ]
                }
            ]
        };
    }

    update(e) {
        this.content = e.target.value;
    }
}