'use strict';

import { bus } from '../EventBus.js';

import { strong } from '../Tome/strong.js';

import { removeAllChildren } from '../util.js';

import {
  templateActionMenu,
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const actionSet = [
  { icon: 'up', label: 'Up' },
  { icon: 'down', label: 'Down' },
  { icon: 'delete', label: 'Delete' },
  { icon: 'cancel', label: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'strong-def', label: 'Strong Definition' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-history', text: 'Strong History' }
];

class StrongHistoryView {

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
        let strongDef = entry.dataset.def;
        if (btn === this.btnDelete) {
          this.delete(strongDef);
        } else if (btn === this.btnDown) {
          this.down(strongDef);
        } else if (btn === this.btnUp) {
          this.up(strongDef);
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

  buildEntry(strongDef) {
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--history');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--history');
    let transliteration = strong.defs[strongDef][1];
    let first = transliteration.replace(',', '').split(' ')[0];
    btnEntry.textContent = `${strongDef} ${first}`;
    btnEntry.dataset.def = strongDef;
    let btnMenu = templateBtnIcon('menu', 'Menu');
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = templatePage('strong-history');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('strong-history');
    this.empty = templateElement('div', 'empty', 'strong-history', null,
      'No Strong saved.');
    this.scroll.appendChild(this.empty);

    this.list = templateElement('div', 'list', 'strong-history', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = templateActionMenu('strong-history', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.clear = templateElement('div', 'clear', 'strong', null,
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
      bus.publish('strong-history.clear', null);
    }
  }

  delete(strongDef) {
    bus.publish('strong-history.delete', strongDef);
  }

  down(strongDef) {
    bus.publish('strong-history.down', strongDef);
  }

  getElements() {
    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnDef = this.toolbarLower.querySelector(
      '.btn-icon--strong-def');
  }

  hide() {
    this.actionMenu.classList.add('action-menu--hide');
    this.page.classList.add('page--hide');
  }

  historyUpdate(strongHstory) {
    this.history = strongHstory;
    this.updateList();
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
        bus.publish('strong-history.select', strongDef);
      } else if (target.classList.contains('btn-icon--menu')) {
        let entry = target.previousSibling;
        this.menuClick(entry);
      }
    }
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  scrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
    } else {
      this.scroll.scrollTop = 0;
    }
  }

  show() {
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
  }

  subscribe() {
    bus.subscribe('strong-history.hide', () => {
      this.hide();
    });
    bus.subscribe('strong-history.show', () => {
      this.show();
    });

    bus.subscribe('strong.history.update', (strongHistory) => {
      this.historyUpdate(strongHistory);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnDef) {
        bus.publish('strong-def', null);
      }
    }
  }

  up(strongDef) {
    bus.publish('strong-history.up', strongDef);
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.history.length === 0) {
      this.empty.classList.remove('empty--hide');
      this.clear.classList.add('clear--hide');
    } else {
      this.empty.classList.add('empty--hide');
      this.clear.classList.remove('clear--hide');
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
