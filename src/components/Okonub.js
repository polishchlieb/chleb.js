import Component from '../lib/Component.js';

import Parser from '../lib/dependencies/Parser.js';

export default class OkoNub extends Component {
    // data = {
    //     works: this.props.works
    // };

    render() {
        if(this.props.works)
            return Parser('<div><h1>oko nub</h1></div>');
        else return Parser('<div></div>');
    }
}