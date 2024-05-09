'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Query' },
  { type: 'input', ariaLabel: 'Query' },
  { type: 'btn', cssModifier: 'search', ariaLabel: null, label: 'Search' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'search-lookup', text: 'Search Lookup' },
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
    this.page = template.page('search-lookup');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('search-lookup');
    this.dialog = template.divDialog('search-lookup', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = template.element('div', 'message', 'search-lookup', null, null);
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
      if (btn === this.btnSearch) {
        this.searchClick();
      }
    }
  }

  error(message) {
    this.queryError = true;
    this.message.textContent = message;
    this.message.classList.remove('hide');
  }

  getElements() {
    this.inputQuery = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnSearch = this.dialogBtns.querySelector('.btn-dialog--search');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.queryError = false;
    this.searchHistorySelect = false;
  }

  inputKeyDown(event) {
    if (event.key === 'Enter') {
      this.inputQuery.blur();
      this.searchClick();
    }
  }

  searchClick() {
    const query = this.inputQuery.value;
    queue.publish('search-lookup.search', query);
  }

  show() {
    if (
      this.searchHistorySelect === true &&
      this.queryError === true
    ) {
      this.inputQuery.value = this.searchQuery;
      this.searchHistorySelect = false;
      this.queryError = false;
    } else {
      this.inputQuery.value = '';
      this.error.textContent = '';
      this.message.textContent = '';
      this.message.classList.add('hide');
    }
    this.page.classList.remove('page--hide');
    this.inputQuery.focus();
  }

  subscribe() {
    queue.subscribe('search.query.change', (searchQuery) => {
      this.searchQuery = searchQuery;
    });
    queue.subscribe('search.query.error', (message) => {
      this.error(message);
    });

    queue.subscribe('search-history.select', () => {
      this.searchHistorySelect = true;;
    });
    queue.subscribe('search-lookup.hide', () => {
      this.hide();
    });
    queue.subscribe('search-lookup.show', () => {
      this.show();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('search.back', null);
      } else if (btn === this.btnResult) {
        queue.publish('search-result', null);
      } else if (btn === this.btnFilter) {
        queue.publish('search-filter', null);
      } else if (btn === this.btnHistory) {
        queue.publish('search-history', null);
      }
    }
  }

}

export { SearchLookupView };
