'use strict';

import queue from '../CommandQueue.js';
import {
  templateActionMenu,
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import { removeAllChildren } from '../util.js';

const actionSet = [
  { icon: 'up', label: 'Up' },
  { icon: 'down', label: 'Down' },
  { icon: 'delete', label: 'Delete' },
  { icon: 'cancel', label: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'result', label: 'Search Result' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'search-history', text: 'Search History' }
];

class SearchHistoryView {

  constructor() {
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnCancel) {
        this.actionMenu.classList.add('action-menu--hide');
      } else {
        let entry = this.activeEntry.querySelector('.btn-entry--history');
        let query = entry.textContent;
        if (btn === this.btnDelete) {
          this.delete(query);
        } else if (btn === this.btnDown) {
          this.down(query);
        } else if (btn === this.btnUp) {
          this.up(query);
        }
        this.actionMenu.classList.add('action-menu--hide');
      }
    }
  }

  addListeners() {
    this.actionMenu.addEventListener('click', (event) => {
      this.actionMenuClick(event);
    });
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.clear.addEventListener('click', (event) => {
      this.clearClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  btnMenuClick(target) {
    this.showActionMenu(target);
  }

  buildEntry(query) {
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--history');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--history');
    btnEntry.textContent = query;
    let btnMenu = templateBtnIcon('menu', 'Menu');
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
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

    this.actionMenu = templateActionMenu('search-history', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.clear = templateElement('div', 'clear', 'search', null,
      null);
    this.btnClear = document.createElement('button');
    this.btnClear.classList.add('btn-clear');
    this.btnClear.textContent = 'Clear History';
    this.clear.appendChild(this.btnClear);
    this.scroll.appendChild(this.clear);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  clearClick(event) {
    event.preventDefault();
    let target = event.target;
    if (target === this.btnClear) {
      queue.publish('search-history.clear', null);
    }
  }

  delete(query) {
    queue.publish('search-history.delete', query);
  }

  down(query) {
    queue.publish('search-history.down', query);
  }

  getElements() {
    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnResult = this.toolbarLower.querySelector(
      '.btn-icon--result');
  }

  hide() {
    this.actionMenu.classList.add('action-menu--hide');
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
      } else if (target.classList.contains('btn-icon--menu')) {
        let entry = target.previousSibling;
        this.btnMenuClick(entry);
      }
    }
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
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
      }
    }
  }

  up(query) {
    queue.publish('search-history.up', query);
  }

  updateHistory() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.history.length === 0) {
      this.empty.classList.remove('empty--hide');
      this.clear.classList.add('clear--hide');
    } else {
      this.empty.classList.add('empty--hide');
      this.clear.classList.remove('clear--hide');
      let fragment = document.createDocumentFragment();
      for (let query of this.history) {
        let entry = this.buildEntry(query);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
    }
  }

}

export { SearchHistoryView };
