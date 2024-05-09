'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'search-lookup', ariaLabel: null },
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'history-clear', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'search-history', text: 'Search History' },
];

class SearchHistoryView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildEntry(query, idx) {
    const entry = document.createElement('div');
    entry.classList.add('entry', 'entry--history');
    const btnEntry = document.createElement('div');
    btnEntry.classList.add('btn-entry', 'btn-entry--history');
    btnEntry.dataset.historyIdx = idx;
    btnEntry.textContent = query;
    entry.appendChild(btnEntry);
    const btnDelete = template.btnIcon('delete', 'delete', null);
    entry.appendChild(btnDelete);
    return entry;
  }

  buildPage() {
    this.page = template.page('search-history');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('search-history');
    this.empty = template.element('div', 'empty', 'search-history', null, 'No Searches Saved');
    this.scroll.appendChild(this.empty);

    this.list = template.element('div', 'list', 'search-history', null, null);
    this.scroll.appendChild(this.list);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  getElements() {
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--search-lookup');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnHistoryClear = this.toolbarLower.querySelector('.btn-icon--history-clear');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  historyUpdate(history) {
    this.history = history;
    this.updateHistory();
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      if (btn.classList.contains('btn-entry--history')) {
        const query = btn.textContent;
        queue.publish('search-history.select', query);
      } else if (btn.classList.contains('btn-icon--delete')) {
        const entry = btn.previousSibling;
        const query = entry.textContent;
        queue.publish('search-history.delete', query);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('search.query.error', () => {
      queue.publish('search-lookup', null);
    });

    queue.subscribe('search-history.hide', () => {
      this.hide();
    });
    queue.subscribe('search-history.show', () => {
      this.show();
    });

    queue.subscribe('search.history.update', (history) => {
      this.historyUpdate(history);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('search.back', null);
      } else if (btn === this.btnLookup) {
        queue.publish('search-lookup', null);
      } else if (btn === this.btnResult) {
        queue.publish('search-result', null);
      } else if (btn === this.btnFilter) {
        queue.publish('search-filter', null);
      } else if (btn === this.btnHistoryClear) {
        queue.publish('search-history.clear', null);
      }
    }
  }

  updateHistory() {
    const scrollSave = this.scroll.scrollTop;
    util.removeAllChildren(this.list);
    if (this.history.length === 0) {
      this.empty.classList.remove('hide');
    } else {
      this.empty.classList.add('hide');
      const fragment = document.createDocumentFragment();
      for (const query of this.history) {
        const entry = this.buildEntry(query);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
    }
    this.scroll.scrollTop = scrollSave;
  }

}

export { SearchHistoryView };
