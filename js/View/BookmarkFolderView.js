'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';

const actionSet = [
  { icon: 'up', ariaLabel: null },
  { icon: 'down', ariaLabel: null },
  { icon: 'rename', ariaLabel: null },
  { icon: 'delete', ariaLabel: null },
  { icon: 'cancel', ariaLabel: null },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'bookmark-folder-add', ariaLabel: null },
  { type: 'btn', icon: 'import', ariaLabel: null },
  { type: 'btn', icon: 'export', ariaLabel: null },
  { type: 'btn', icon: 'bookmark-list', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-folder', text: 'Bookmark Folder' },
];

class BookmarkFolderView {

  constructor() {
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnCancel) {
        this.actionMenu.classList.add('hide');
      } else {
        const entry = this.activeEntry.querySelector('.btn-entry');
        const folderName = entry.textContent;
        if (btn === this.btnDelete) {
          this.delete(folderName);
        } else if (btn === this.btnDown) {
          this.down(folderName);
        } else if (btn === this.btnRename) {
          this.rename(folderName);
        } else if (btn === this.btnUp) {
          this.up(folderName);
        }
        this.actionMenu.classList.add('hide');
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
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildEntry(folderName) {
    const entry = document.createElement('div');
    entry.classList.add('entry', 'entry--folder');
    const btnEntry = document.createElement('div');
    btnEntry.classList.add('btn-entry', 'btn-entry--folder');
    btnEntry.textContent = folderName;
    const btnMenu = template.btnIcon('h-menu', 'h-menu', null);
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = template.page('bookmark-folder');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-folder');

    this.list = template.element('div', 'list', 'bookmark-folder', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = template.actionMenu('bookmark-folder', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  delete(folderName) {
    queue.publish('bookmark-folder.delete', folderName);
  }

  down(folderName) {
    queue.publish('bookmark-folder.down', folderName);
  }

  folderListUpdate(folderList) {
    this.folderList = folderList;
    this.updateFolders();
  }

  getElements() {
    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnRename = this.actionMenu.querySelector('.btn-icon--rename');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnBookmarkList = this.toolbarLower.querySelector('.btn-icon--bookmark-list');
    this.btnBookmarkFolderAdd = this.toolbarLower.querySelector('.btn-icon--bookmark-folder-add');
    this.btnImport = this.toolbarLower.querySelector('.btn-icon--import');
    this.btnExport = this.toolbarLower.querySelector('.btn-icon--export');
  }

  hide() {
    this.page.classList.add('page--hide');
    this.actionMenu.classList.add('hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      if (btn.classList.contains('btn-entry')) {
        const folderName = btn.textContent;
        queue.publish('bookmark-folder.select', folderName);
      } else if (btn.classList.contains('btn-icon--h-menu')) {
        const entry = btn.previousSibling;
        this.menuClick(entry);
      }
    }
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  rename(folderName) {
    queue.publish('bookmark-folder-rename', folderName);
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div.entry');
    const top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('hide');
  }

  subscribe() {
    queue.subscribe('bookmark-folder.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-folder.show', () => {
      this.show();
    });

    queue.subscribe('bookmark.folder-list.update', (folderList) => {
      this.folderListUpdate(folderList);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('bookmark.back', null);
      } else if (btn === this.btnBookmarkList) {
        queue.publish('bookmark-list', null);
      } else if (btn === this.btnBookmarkFolderAdd) {
        queue.publish('bookmark-folder-add', null);
      } else if (btn === this.btnExport) {
        queue.publish('bookmark-export', null);
      } else if (btn === this.btnImport) {
        queue.publish('bookmark-import', null);
      }
    }
  }

  up(folderName) {
    queue.publish('bookmark-folder.up', folderName);
  }

  updateFolders() {
    const scrollSave = this.scroll.scrollTop;
    util.removeAllChildren(this.list);
    const fragment = document.createDocumentFragment();
    for (const folderName of this.folderList) {
      const entry = this.buildEntry(folderName);
      fragment.appendChild(entry);
    }
    this.list.appendChild(fragment);
    this.scroll.scrollTop = scrollSave;
  }

}

export { BookmarkFolderView };
