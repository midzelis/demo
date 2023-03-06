import { LightningElement } from 'lwc';

export default class App extends LightningElement {

  connectedCallback() {

    debugger
    const callback = (records) => {
      console.log(records);
    };

    const config = { attributes: true, childList: true, subtree: true };

    const o =  new MutationObserver(callback).observe(template.shadowRoot, config);

  }
}