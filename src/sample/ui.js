import App from './components/App.js';
import { assertHTMLElement } from './utils.js';

/** @type {App} */
let app;

function main() {
    const appElement = assertHTMLElement(document.querySelector('.app'));
    app = new App(appElement); app;
}


document.addEventListener('DOMContentLoaded', main);