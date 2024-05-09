'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const dialogToolset = [
  { type: 'label', text: null },
  { type: 'btn', cssModifier: 'delete', ariaLabel: null, label: 'Delete' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-folder-delete', text: 'Folder Delete' },
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
    this.page = template.page('bookmark-folder-delete');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-folder-delete');
    this.dialog = template.divDialog('bookmark-folder-delete', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  deleteClick() {
    queue.publish('bookmark-folder-delete.confirm', this.folderName);
  }

  dialogClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-dialog');
    if (btn) {
      if (btn === this.btnDelete) {
        this.deleteClick();
      }
    }
  }

  folderToDelete(folderName) {
    this.folderName = folderName;
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--bookmark-folder-delete');

    this.label = this.dialog.querySelector('.dialog-label');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnDelete = this.dialogBtns.querySelector('.btn-dialog--delete');

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
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      }
    }
  }

  updateLabel() {
    this.label.innerHTML = `Delete Folder '${this.folderName}'?`;
  }

}

export { BookmarkFolderDeleteView };
