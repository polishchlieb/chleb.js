import Component from '../lib/Component.js';

import Parser from '../lib/dependencies/Parser.js';

export default class OkoNub extends Component {
    render() {
        // return {
        //     node: 'h1',
        //     children: [
        //         this.props.noobity
        //     ]
        // }

        return Parser('<h1><OkoNub></OkoNub></h1>');
    }
}