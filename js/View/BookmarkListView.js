'use strict';

import { bus } from '../EventBus.js';
import {
  templateActionMenu,
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import {
  citationByVerseIdx,
  removeAllChildren
} from '../util.js';

const actionSet = [
  { icon: 'up', label: 'Up' },
  { icon: 'down', label: 'Down' },
  { icon: 'move-copy', label: 'Move/Copy' },
  { icon: 'delete', label: 'Delete' },
  { icon: 'cancel', label: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'sort-ascend', label: 'Sort Ascending' },
  { type: 'btn', icon: 'sort-invert', label: 'Sort Invert' },
  { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' },
  { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'bookmark-list', text: null },
];

class BookmarkListView {

  constructor() {
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn === this.btnCancel) {
      this.actionMenu.classList.add('action-menu--hide');
    } else {
      let btnEntry = this.activeEntry.querySelector('.btn-entry');
      let verseIdx = parseInt(btnEntry.dataset.verseIdx);
      if (btn === this.btnUp) {
        this.up(verseIdx);
      } else if (btn === this.btnDown) {
        this.down(verseIdx);
      } else if (btn === this.btnMoveCopy) {
        this.moveCopy(verseIdx);
      } else if (btn === this.btnDelete) {
        this.delete(verseIdx);
      }
      this.actionMenu.classList.add('action-menu--hide');
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

  buildEntry(verseIdx) {
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--bookmark');
    let btnRef = document.createElement('button');
    btnRef.classList.add('btn-entry', 'btn-entry--bookmark');
    btnRef.textContent = citationByVerseIdx(verseIdx);
    btnRef.dataset.verseIdx = verseIdx;
    entry.appendChild(btnRef);
    let btnMenu = templateBtnIcon('menu', 'Menu');
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = templatePage('bookmark-list');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('bookmark-list');

    this.empty = templateElement('div', 'empty', 'bookmark-list', null,
      'No bookmarks saved.');
    this.scroll.appendChild(this.empty);

    this.list = templateElement('div', 'list', 'bookmark-list', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = templateActionMenu('bookmark-list', actionSet);
    this.scroll.appendChild(this.actionMenu);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  delete(verseIdx) {
    bus.publish('bookmark-list.delete', verseIdx);
  }

  down(verseIdx) {
    bus.publish('bookmark-list.down', verseIdx);
  }

  getElements() {
    this.btnFolderAdd = this.toolbarUpper.querySelector(
      '.btn-icon--folder-add');
    this.banner = this.toolbarUpper.querySelector('.banner--bookmark-list');

    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnMoveCopy = this.actionMenu.querySelector('.btn-icon--move-copy');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnSortAscend = this.toolbarLower.querySelector(
      '.btn-icon--sort-ascend');
    this.btnSortInvert = this.toolbarLower.querySelector(
      '.btn-icon--sort-invert');
    this.btnStrongMode = this.toolbarLower.querySelector(
      '.btn-icon--strong-mode');
    this.btnBookmarkFolder = this.toolbarLower.querySelector(
      '.btn-icon--bookmark-folder');
  }

  hide() {
    this.actionMenu.classList.add('action-menu--hide');
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target.classList.contains('btn-entry')) {
        let verseIdx = parseInt(target.dataset.verseIdx);
        if (this.strongMode) {
          bus.publish('bookmark-list.strong-select', verseIdx);
        } else {
          bus.publish('bookmark-list.select', verseIdx);
        }
      } else if (target.classList.contains('btn-icon--menu')) {
        let ref = target.previousSibling;
        this.menuClick(ref);
      }
    }
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  modeUpdate(strongMode) {
    this.strongMode = strongMode;
    if (this.strongMode) {
      this.btnStrongMode.classList.add('btn-icon--active');
    } else {
      this.btnStrongMode.classList.remove('btn-icon--active');
    }
  }

  moveCopy(verseIdx) {
    bus.publish('bookmark-move-copy', verseIdx);
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
  }

  subscribe() {
    bus.subscribe('bookmark-list.hide', () => {
      this.hide();
    });
    bus.subscribe('bookmark-list.show', () => {
      this.show();
    });

    bus.subscribe('bookmark.strong-mode.update', (strongMode) => {
      this.modeUpdate(strongMode);
    });

    bus.subscribe('folder.update', (folder) => {
      this.updateFolder(folder);
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        bus.publish('bookmark.back', null);
      } else if (target === this.btnSortAscend) {
        bus.publish('bookmark-list.sort-ascend', null);
      } else if (target === this.btnSortInvert) {
        bus.publish('bookmark-list.sort-invert', null);
      } else if (target === this.btnStrongMode) {
        bus.publish('bookmark.strong-mode.click', null);
      } else if (target === this.btnBookmarkFolder) {
        bus.publish('bookmark-folder', null);
      }
    }
  }

  up(verseIdx) {
    bus.publish('bookmark-list.up', verseIdx);
  }

  updateBanner() {
    this.banner.innerHTML = `${this.folder.name}`;
  }

  updateFolder(folder) {
    this.folder = folder;
    this.updateBanner();
    this.updateList();
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.folder.bookmarks.length === 0) {
      this.empty.classList.remove('empty--hide');
    } else {
      this.empty.classList.add('empty--hide');
      let fragment = document.createDocumentFragment();
      for (let verseIdx of this.folder.bookmarks) {
        let ref = this.buildEntry(verseIdx);
        fragment.appendChild(ref);
      }
      this.list.appendChild(fragment);
    }
  }

}

export { BookmarkListView };
