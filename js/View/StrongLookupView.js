'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Strong Number' },
  { type: 'input', ariaLabel: 'Strong Number' },
  { type: 'btn', cssModifier: 'find', ariaLabel: null, label: 'Find' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'strong-def', ariaLabel: null },
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
  { type: 'btn', icon: 'strong-verse', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'strong-lookup', text: 'Strong Lookup' },
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
    this.page = template.page('strong-lookup');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('strong-lookup');
    this.dialog = template.divDialog('strong-lookup', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = template.element('div', 'message', 'strong-lookup', null, null);
    this.scroll.appendChild(this.message);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  dialogClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-dialog');
    if (btn) {
      if (btn === this.btnFind) {
        this.findClick();
      }
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('hide');
  }

  findClick() {
    const strongNum = this.inputStrongNum.value;
    queue.publish('strong-lookup.find', strongNum.toUpperCase());
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--strong-lookup');

    this.inputStrongNum = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnFind = this.dialogBtns.querySelector('.btn-dialog--find');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
    this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
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
      this.inputStrongNum.blur();
      this.findClick();
    }
  }

  show() {
    this.inputStrongNum.value = '';
    this.error.textContent = '';
    this.page.classList.remove('page--hide');
    this.message.classList.add('hide');
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
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('strong.back', null);
      } else if (btn === this.btnDef) {
        queue.publish('strong-def', null);
      } else if (btn === this.btnResult) {
        queue.publish('strong-result', null);
      } else if (btn === this.btnFilter) {
        queue.publish('strong-filter', null);
      } else if (btn === this.btnHistory) {
        queue.publish('strong-history', null);
      } else if (btn === this.btnVerse) {
        queue.publish('strong-verse', null);
      }
    }
  }

}

export { StrongLookupView };
