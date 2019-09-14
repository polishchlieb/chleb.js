import Component from '../lib/Component.js'
import OkoNub from './Okonub.js';

export default class App extends Component {
    data = {
        content: ''
    };

    components = {
        OkoNub
    };

    render() {
        return {
            node: 'div',
            attributes: { class: 'app' },
            children: [
                {
                    node: 'div',
                    children: [{
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
                    }]
                },
                {
                    node: 'div',
                    children: [
                        {
                            node: OkoNub,
                            attributes: {
                                works: this.content.length > 0
                            }
                        }
                    ]
                }
            ]
        };
    }

    update(e) {
        this.content = e.target.value;
    }
}