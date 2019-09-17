import Bread from './lib/Bread.js';
import App from './components/App.js';

new Bread({ app: App })
	.render(document.querySelector('#root'));