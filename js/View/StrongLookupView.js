'use strict';

import queue from '../CommandQueue.js';

import {
  templateDivDialog,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Strong Number' },
  { type: 'input', label: 'Strong Number' },
  { type: 'btn', id: 'find', label: 'Find' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'strong-def', label: 'Strong Definition' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-lookup', text: 'Strong Lookup' },
];

class StrongLookupView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.dialogBtns.addEventListener('click', (event) => {
      this.dialogClick(event);
    });
    this.inputStrongNum.addEventListener('keydown', (event) => {
      this.inputKeyDown(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('strong-lookup');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('strong-lookup');
    this.dialog = templateDivDialog('strong-lookup', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = templateElement('div', 'message',
      'strong-lookup', null, null);
    this.scroll.appendChild(this.message);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  dialogClick(event) {
    event.preventDefault();
    let target = event.target;
    if (target === this.btnFind) {
      this.findClick();
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('message--hide');
  }

  findClick() {
    let strongNum = this.inputStrongNum.value;
    if (strongNum) {
      queue.publish('strong-lookup.find', strongNum.toUpperCase());
    }
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--strong-lookup');

    this.inputStrongNum = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnFind = this.dialogBtns.querySelector('.btn-dialog--find');

    this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  inputKeyDown(event) {
    if (event.key === 'Enter') {
      this.findClick();
    }
  }

  show() {
    this.inputStrongNum.value = '';
    this.error.textContent = '';
    this.message.classList.add('message--hide');
    this.page.classList.remove('page--hide');
    this.inputStrongNum.focus();
  }

  subscribe() {
    queue.subscribe('strong-lookup.hide', () => {
      this.hide();
    });
    queue.subscribe('strong-lookup.show', () => {
      this.show();
    });

    queue.subscribe('strong.def.error', (message) => {
      this.error(message);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnDef) {
        queue.publish('strong-def', null);
      }
    }
  }

}

export { StrongLookupView };
