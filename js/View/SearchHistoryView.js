'use strict';

import queue from '../CommandQueue.js';
import {
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import { removeAllChildren } from '../util.js';

const lowerToolSet = [
  { type: 'btn', icon: 'result', label: 'Search Result' },
  { type: 'btn', icon: 'history-clear', label: 'Clear Hitory' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'search-history', text: 'Search History' }
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
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--history');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--history');
    btnEntry.dataset.historyIdx = idx;
    btnEntry.textContent = query;
    entry.appendChild(btnEntry);
    let btnDelete = templateBtnIcon('delete', 'Delete');
    entry.appendChild(btnDelete);
    return entry;
  }

  buildPage() {
    this.page = templatePage('search-history');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('search-history');
    this.empty = templateElement('div', 'empty', 'search-history', null,
      'No searches saved.');
    this.scroll.appendChild(this.empty);

    this.list = templateElement('div', 'list', 'search-history', null, null);
    this.scroll.appendChild(this.list);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  delete(historyIdx) {
    queue.publish('search-history.delete', historyIdx);
  }

  down(query) {
    queue.publish('search-history.down', query);
  }

  getElements() {
    this.btnResult = this.toolbarLower.querySelector(
      '.btn-icon--result');
    this.btnHistoryClear = this.toolbarLower.querySelector(
      '.btn-icon--history-clear');
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
    let target = event.target.closest('button');
    if (target) {
      if (target.classList.contains('btn-entry--history')) {
        let query = target.textContent;
        queue.publish('search-history.select', query);
      } else if (target.classList.contains('btn-icon--delete')) {
        let entry = target.previousSibling;
        let query = entry.textContent;
        queue.publish('search-history.delete', query);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
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
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnResult) {
        queue.publish('search-result', null);
      } else if (target === this.btnHistoryClear) {
        queue.publish('search-history.clear', null);
      }
    }
  }

  updateHistory() {
    let scrollSave = this.scroll.scrollTop;
    removeAllChildren(this.list);
    if (this.history.length === 0) {
      this.empty.classList.remove('empty--hide');
    } else {
      this.empty.classList.add('empty--hide');
      let fragment = document.createDocumentFragment();
      for (let query of this.history) {
        let entry = this.buildEntry(query);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
    }
    this.scroll.scrollTop = scrollSave;
  }

}

export { SearchHistoryView };
