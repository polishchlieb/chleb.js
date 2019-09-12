import Bread from './lib/Bread.js';

import App from './components/App.js';

let start = new Date();

new Bread({ app: App })
	.render(document.querySelector('#root'));