'use strict';

import queue from '../CommandQueue.js';

import {
  templateElement,
  templateDivDialog,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Paste Bookmark Package Here:' },
  { type: 'textarea', label: 'Bookmark Package' },
  { type: 'btn', id: 'import', label: 'Import' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'bookmark-import', text: 'Bookmark Import' }
];

class BookmarkImportView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.dialogBtns.addEventListener('click', (event) => {
      this.dialogClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('bookmark-import');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('bookmark-import');
    this.dialog = templateDivDialog('bookmark-import', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = templateElement('div', 'message', 'bookmark-import', null,
      null);
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
    if (target === this.btnImport) {
      this.importClick();
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('message--hide');
    if (message === 'Import successful.') {
      this.textarea.value = '';
    }
  }

  getElements() {
    this.textarea = this.scroll.querySelector('.dialog-textarea');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnImport = this.dialogBtns.querySelector('.btn-dialog--import');

    this.btnBookmarkFolder = this.toolbarLower.querySelector(
      '.btn-icon--bookmark-folder');
  }

  importClick() {
    this.message.textContent = '';
    let pkgStr = this.textarea.value;
    if (pkgStr) {
      queue.publish('bookmark-import.import', pkgStr);
    }
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

  show() {
    this.textarea.value = '';
    this.message.textContent = '';
    this.message.classList.add('message--hide');
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('bookmark-import.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-import.message', (message) => {
      this.error(message);
    });
    queue.subscribe('bookmark-import.show', () => {
      this.show();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      }
    }
  }

}

export { BookmarkImportView };
