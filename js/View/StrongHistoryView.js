'use strict';

import { queue } from '../CommandQueue.js';
import { util } from '../util.js';
import { template } from '../template.js';
import { strongCitations } from '../data/strongDictDb.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
  { type: 'btn', icon: 'strong-def', ariaLabel: null },
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'strong-verse', ariaLabel: null },
  { type: 'btn', icon: 'history-clear', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'strong-history', text: 'Strong History' },
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
    const entry = document.createElement('div');
    entry.classList.add('entry', 'entry--history');
    const btnEntry = document.createElement('div');
    btnEntry.classList.add('btn-entry', 'btn-entry--history');
    const transliteration = strongCitations[strongDef];
    const first = transliteration.replace(',', '').split(' ')[firstXlit];
    btnEntry.textContent = `${strongDef} ${first.normalize('NFC')}`;
    btnEntry.dataset.def = strongDef;
    entry.appendChild(btnEntry);
    const btnDelete = template.btnIcon('delete', 'delete', null);
    entry.appendChild(btnDelete);
    return entry;
  }

  buildPage() {
    this.page = template.page('strong-history');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('strong-history');
    this.empty = template.element('div', 'empty', 'strong-history', null, 'No Strong History.');
    this.scroll.appendChild(this.empty);

    this.list = template.element('div', 'list', 'strong-history', null, null);
    this.scroll.appendChild(this.list);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  getElements() {
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
    this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
    this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
    this.btnHistoryClear = this.toolbarLower.querySelector('.btn-icon--history-clear');
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
    const btn = event.target.closest('div');
    if (btn) {
      if (btn.classList.contains('btn-entry--history')) {
        const strongDef = btn.dataset.def;
        queue.publish('strong-history.select', strongDef);
      } else if (btn.classList.contains('btn-icon--delete')) {
        const entry = btn.previousSibling;
        const strongDef = entry.dataset.def;
        queue.publish('strong-history.delete', strongDef);
      }
    }
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
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('strong.back', null);
      } else if (btn === this.btnLookup) {
        queue.publish('strong-lookup', null);
      } else if (btn === this.btnDef) {
        queue.publish('strong-def', null);
      } else if (btn === this.btnResult) {
        queue.publish('strong-result', null);
      } else if (btn === this.btnFilter) {
        queue.publish('strong-filter', null);
      } else if (btn === this.btnVerse) {
        queue.publish('strong-verse', null);
      } else if (btn === this.btnHistoryClear) {
        queue.publish('strong-history.clear', null);
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
      for (const strongDef of this.history) {
        const entry = this.buildEntry(strongDef);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
    }
    this.scroll.scrollTop = scrollSave;
  }

}

export { StrongHistoryView };
