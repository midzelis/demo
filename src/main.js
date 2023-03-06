import '@lwc/synthetic-shadow'
import { createElement } from "lwc";
import App from "x/app";

import mask from 'x/mask';

const elm = createElement("x-app", { is: App });
document.body.appendChild(elm);

const m = new mask(document.body);


