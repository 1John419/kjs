'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Paste Bookmark Package Here:' },
  { type: 'textarea', ariaLabel: 'Bookmark Package' },
  { type: 'btn', cssModifier: 'import', ariaLabel: null, label: 'Import' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-import', text: 'Bookmark Import' },
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
    this.page = template.page('bookmark-import');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-import');
    this.dialog = template.divDialog('bookmark-import', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = template.element('div', 'message', 'bookmark-import', null, null);
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
      if (btn === this.btnImport) {
        this.importClick();
      }
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('hide');
    if (message === 'Import successful.') {
      this.textarea.value = '';
    }
  }

  getElements() {
    this.textarea = this.scroll.querySelector('.dialog-textarea');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnImport = this.dialogBtns.querySelector('.btn-dialog--import');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
  }

  importClick() {
    this.message.textContent = '';
    const pkgStr = this.textarea.value;
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
    this.message.classList.add('hide');
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
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('bookmark.back', null);
      } else if (btn === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      }
    }
  }

}

export { BookmarkImportView };
