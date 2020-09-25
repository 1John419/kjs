'use strict';

import queue from '../CommandQueue.js';
import { strongCitations } from '../data/strongDb.js';
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
  { type: 'btn', icon: 'strong-def', label: 'Strong Definition' },
  { type: 'btn', icon: 'history-clear', label: 'Clear Hitory' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-history', text: 'Strong History' }
];

const firstXlit = 0;

class StrongHistoryView {

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

  buildEntry(strongDef) {
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--history');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--history');
    let transliteration = strongCitations[strongDef];
    let first = transliteration.replace(',', '').split(' ')[firstXlit];
    btnEntry.textContent = `${strongDef} ${first.normalize('NFC')}`;
    btnEntry.dataset.def = strongDef;
    entry.appendChild(btnEntry);
    let btnDelete = templateBtnIcon('delete', 'Delete');
    entry.appendChild(btnDelete);
    return entry;
  }

  buildPage() {
    this.page = templatePage('strong-history');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('strong-history');
    this.empty = templateElement('div', 'empty', 'strong-history', null,
      'No Strong History.');
    this.scroll.appendChild(this.empty);

    this.list = templateElement('div', 'list', 'strong-history', null, null);
    this.scroll.appendChild(this.list);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  delete(strongDef) {
    queue.publish('strong-history.delete', strongDef);
  }

  getElements() {
    this.btnDef = this.toolbarLower.querySelector(
      '.btn-icon--strong-def');
    this.btnHistoryClear = this.toolbarLower.querySelector(
      '.btn-icon--history-clear');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  historyUpdate(strongHstory) {
    this.history = strongHstory;
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
        let strongDef = target.dataset.def;
        queue.publish('strong-history.select', strongDef);
      } else if (target.classList.contains('btn-icon--delete')) {
        let entry = target.previousSibling;
        let strongDef = entry.dataset.def;
        queue.publish('strong-history.delete', strongDef);
      }
    }
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('strong-history.hide', () => {
      this.hide();
    });
    queue.subscribe('strong-history.show', () => {
      this.show();
    });

    queue.subscribe('strong.history.update', (strongHistory) => {
      this.historyUpdate(strongHistory);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnDef) {
        queue.publish('strong-def', null);
      } else if (target === this.btnHistoryClear) {
        queue.publish('strong-history.clear', null);
      }
    }
  }

  updateHistory() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.history.length === 0) {
      this.empty.classList.remove('empty--hide');
    } else {
      this.empty.classList.add('empty--hide');
      let fragment = document.createDocumentFragment();
      for (let strongDef of this.history) {
        let entry = this.buildEntry(strongDef);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
    }
  }

}

export { StrongHistoryView };
