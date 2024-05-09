'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Name' },
  { type: 'input', ariaLabel: 'Name' },
  { type: 'btn', cssModifier: 'save', ariaLabel: null, label: 'Save' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-folder-add', text: 'Folder Add' },
];

class BookmarkFolderAddView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.dialogBtns.addEventListener('click', (event) => {
      this.dialogClick(event);
    });
    this.inputName.addEventListener('keydown', (event) => {
      this.inputKeyDown(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = template.page('bookmark-folder-add');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-folder-add');
    this.dialog = template.divDialog('bookmark-folder-add', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = template.element('div', 'message', 'bookmark-folder-add', null, null);
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
      if (btn === this.btnSave) {
        this.saveClick();
      }
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('hide');
  }

  getElements() {
    this.inputName = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
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
      this.inputName.blur();
      this.saveClick();
    }
  }

  saveClick() {
    const name = this.inputName.value;
    if (name) {
      queue.publish('bookmark-folder-add.save', name);
    }
  }

  show() {
    this.page.classList.remove('page--hide');
    this.message.classList.add('hide');
    this.inputName.value = '';
    this.inputName.focus();
  }

  subscribe() {
    queue.subscribe('bookmark-folder-add.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-folder-add.show', () => {
      this.show();
    });

    queue.subscribe('bookmark.folder.add.error', (message) => {
      this.error(message);
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

export { BookmarkFolderAddView };
