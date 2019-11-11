'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  templateDivDialog,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const message = 'Select All and Copy the text below. ' +
  'Then Paste in a text editor and save the file.';

const dialogToolset = [
  { type: 'label', text: message },
  { type: 'textarea', label: 'Bookmark Package' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'bookmark-export', text: 'Bookmark Export' }
];

class BookmarkExportview {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildBookmarkPkg() {
    let bookmarkPkg = {};
    bookmarkPkg.tome = tome.name;
    bookmarkPkg.folders = this.folders;
    return JSON.stringify(bookmarkPkg, null, 2);
  }

  buildPage() {
    this.page = templatePage('bookmark-export');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('bookmark-export');
    this.dialog = templateDivDialog('bookmark-export', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  foldersUpdate(folders) {
    this.folders = folders;
  }

  getElements() {
    this.textarea = this.scroll.querySelector('.dialog-textarea');

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

  show() {
    this.page.classList.remove('page--hide');
    this.textarea.value = this.buildBookmarkPkg();
  }

  subscribe() {
    bus.subscribe('bookmark-export.hide', () => {
      this.hide();
    });
    bus.subscribe('bookmark-export.show', () => {
      this.show();
    });

    bus.subscribe('folders.update', (folders) => {
      this.foldersUpdate(folders);
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

export { BookmarkExportview };
