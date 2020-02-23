'use strict';

import queue from '../CommandQueue.js';

import {
  templateDivDialog,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const dialogToolset = [
  { type: 'label', text: null },
  { type: 'btn', id: 'delete', label: 'Delete' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'bookmark-folder-delete',
    text: 'Folder Delete' }
];

class BookmarkFolderDeleteView {

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
    this.page = templatePage('bookmark-folder-delete');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('bookmark-folder-delete');
    this.dialog = templateDivDialog('bookmark-folder-delete', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  deleteClick() {
    queue.publish('bookmark-folder-delete.confirm', this.folderName);
  }

  dialogClick(event) {
    event.preventDefault();
    let target = event.target;
    if (target === this.btnDelete) {
      this.deleteClick();
    }
  }

  folderToDelete(folderName) {
    this.folderName = folderName;
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector(
      '.banner--bookmark-folder-delete');

    this.label = this.dialog.querySelector('.dialog-label');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnDelete = this.dialogBtns.querySelector('.btn-dialog--delete');

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
    this.updateLabel();
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('bookmark-folder-delete.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-folder-delete.show', () => {
      this.show();
    });

    queue.subscribe('folder.to.delete', (folderName) => {
      this.folderToDelete(folderName);
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

  updateLabel() {
    this.label.innerHTML = `Delete Folder '${this.folderName}'?`;
  }

}

export { BookmarkFolderDeleteView };
