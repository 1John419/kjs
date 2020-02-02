'use strict';

import { queue } from '../CommandQueue.js';

import {
  templateDivDialog,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Query' },
  { type: 'input', label: 'Query' },
  { type: 'btn', id: 'search', label: 'Search' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'result', label: 'Search Result' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'search-lookup', text: 'Search Lookup' }
];

class SearchLookupView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.dialogBtns.addEventListener('click', (event) => {
      this.dialogClick(event);
    });
    this.inputQuery.addEventListener('keydown', (event) => {
      this.inputKeyDown(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('search-lookup');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('search-lookup');
    this.dialog = templateDivDialog('search-lookup', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = templateElement('div', 'message',
      'search-lookup', null, null);
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
    if (target === this.btnSearch) {
      this.searchClick();
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('message--hide');
  }

  getElements() {
    this.inputQuery = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnSearch = this.dialogBtns.querySelector('.btn-dialog--search');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnResult = this.toolbarLower.querySelector(
      '.btn-icon--result');
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
      this.searchClick();
    }
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  searchClick() {
    let query = this.inputQuery.value;
    queue.publish('search-lookup.search', query);
  }

  show() {
    this.inputQuery.value = '';
    this.error.textContent = '';
    this.message.classList.add('message--hide');
    this.page.classList.remove('page--hide');
    this.inputQuery.focus();
  }

  subscribe() {
    queue.subscribe('search.query.error', (message) => {
      this.error(message);
    });
    queue.subscribe('search-lookup.hide', () => {
      this.hide();
    });
    queue.subscribe('search-lookup.show', () => {
      this.show();
    });

    queue.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        queue.publish('search.back', null);
      } else if (target === this.btnResult) {
        queue.publish('search-result', null);
      }
    }
  }

}

export { SearchLookupView };
