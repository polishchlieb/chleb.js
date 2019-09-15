import Component from '../lib/Component.js'
import OkoNub from './Okonub.js';

export default class App extends Component {
    data = {
        color: 'white',
        text: ''
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
                    children: [
                        {
                            node: 'input',
                            attributes: { type: 'text', test: this.color },
                            events: [
                                {
                                    name: 'input',
                                    callback: e => this.update(e)
                                }
                            ],
                            children: [],
                            style: {
                                'background-color': this.color
                            }
                        }
                    ]
                },
                {
                    node: 'h1',
                    children: [
                        this.text
                    ]
                }
            ]
        };
    }

    update(e) {
        let { value } = e.target;
        this.color = value;

        if(value === 'oko nub') this.text = value
        else this.text = ''
    }
}