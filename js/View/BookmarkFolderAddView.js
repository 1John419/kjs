'use strict';

import { queue } from '../CommandQueue.js';

import {
  templateDivDialog,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Name' },
  { type: 'input', label: 'Name' },
  { type: 'btn', id: 'save', label: 'Save' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'bookmark-folder-add', text: 'Folder Add' }
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
    this.page = templatePage('bookmark-folder-add');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('bookmark-folder-add');
    this.dialog = templateDivDialog('bookmark-folder-add', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = templateElement('div', 'message',
      'bookmark-folder-add', null, null);
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
    if (target === this.btnSave) {
      this.saveClick();
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('message--hide');
  }

  getElements() {
    this.inputName = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

    this.btnBookmarkFolder = this.toolbarLower.querySelector(
      '.btn-icon--bookmark-folder');
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
      this.saveClick();
    }
  }

  saveClick() {
    let name = this.inputName.value;
    if (name) {
      queue.publish('bookmark-folder-add.save', name);
    }
  }

  show() {
    this.page.classList.remove('page--hide');
    this.message.classList.add('message--hide');
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
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      }
    }
  }

}

export { BookmarkFolderAddView };
