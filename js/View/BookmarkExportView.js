'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { tomeLists } from '../data/tomeLists.js';

const message = 'Select All and Copy the text below. ' +
  'Then Paste in a text editor and save the file.';

const dialogToolset = [
  { type: 'label', text: message },
  { type: 'textarea', ariaLabel: null, label: 'Bookmark Package' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-export', text: 'Bookmark Export' },
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
    const bookmarkPkg = {};
    bookmarkPkg.tome = tomeLists.tomeName;
    bookmarkPkg.folders = [];
    for (const folder of this.folders) {
      const newFolder = {};
      newFolder.name = folder.name;
      newFolder.bookmarks = folder.bookmarks;
      bookmarkPkg.folders.push(newFolder);
    }
    return JSON.stringify(bookmarkPkg, null);
  }

  buildPage() {
    this.page = template.page('bookmark-export');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-export');
    this.dialog = template.divDialog('bookmark-export', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  foldersUpdate(folders) {
    this.folders = folders;
  }

  getElements() {
    this.textarea = this.scroll.querySelector('.dialog-textarea');

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

  show() {
    this.page.classList.remove('page--hide');
    this.textarea.value = this.buildBookmarkPkg();
  }

  subscribe() {
    queue.subscribe('bookmark-export.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-export.show', () => {
      this.show();
    });

    queue.subscribe('bookmark.folders.update', (folders) => {
      this.foldersUpdate(folders);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('bookmark.back', null);
      }  else if (btn === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      }
    }
  }

}

export { BookmarkExportview };
