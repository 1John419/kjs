'use strict';

import { bus } from '../EventBus.js';

import {
  templateDivDialog,
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
      this.inputName.value = '';
      bus.publish('bookmark-folder-add.save', name);
    }
  }

  show() {
    this.page.classList.remove('page--hide');
    this.inputName.focus();
  }

  subscribe() {
    bus.subscribe('bookmark-folder-add.hide', () => {
      this.hide();
    });
    bus.subscribe('bookmark-folder-add.show', () => {
      this.show();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBookmarkFolder) {
        bus.publish('bookmark-folder', null);
      }
    }
  }

}

export { BookmarkFolderAddView };
