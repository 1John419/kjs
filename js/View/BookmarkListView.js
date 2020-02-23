'use strict';

import queue from '../CommandQueue.js';
import {
  templateActionMenu,
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import { citationByVerseIdx } from '../data/tomeDb.js';
import { removeAllChildren } from '../util.js';

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
  { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' },
  { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' }
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
    queue.publish('bookmark-list.delete', verseIdx);
  }

  down(verseIdx) {
    queue.publish('bookmark-list.down', verseIdx);
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
          queue.publish('bookmark-list.strong-select', verseIdx);
        } else {
          queue.publish('bookmark-list.select', verseIdx);
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

  moveCopy(verseIdx) {
    queue.publish('bookmark-list.move-copy', verseIdx);
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

  strongModeUpdate(strongMode) {
    this.strongMode = strongMode;
    if (this.strongMode) {
      this.btnStrongMode.classList.add('btn-icon--active');
    } else {
      this.btnStrongMode.classList.remove('btn-icon--active');
    }
  }

  subscribe() {
    queue.subscribe('bookmark-list.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-list.show', () => {
      this.show();
    });

    queue.subscribe('bookmark.active-folder.update', (activeFolder) => {
      this.updateActiveFolder(activeFolder);
    });
    queue.subscribe('bookmark.strong-mode.update', (strongMode) => {
      this.strongModeUpdate(strongMode);
    });

    queue.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        queue.publish('bookmark.back', null);
      } else if (target === this.btnSortAscend) {
        queue.publish('bookmark-list.sort-ascend', null);
      } else if (target === this.btnSortInvert) {
        queue.publish('bookmark-list.sort-invert', null);
      } else if (target === this.btnStrongMode) {
        queue.publish('bookmark-list.strong-mode.click', null);
      } else if (target === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      }
    }
  }

  up(verseIdx) {
    queue.publish('bookmark-list.up', verseIdx);
  }

  updateBanner() {
    this.banner.innerHTML = `${this.activeFolder.name}`;
  }

  updateActiveFolder(activeFolder) {
    this.activeFolder = activeFolder;
    this.updateBanner();
    this.updateBookmarks();
  }

  updateBookmarks() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.activeFolder.bookmarks.length === 0) {
      this.empty.classList.remove('empty--hide');
    } else {
      this.empty.classList.add('empty--hide');
      let fragment = document.createDocumentFragment();
      for (let verseIdx of this.activeFolder.bookmarks) {
        let ref = this.buildEntry(verseIdx);
        fragment.appendChild(ref);
      }
      this.list.appendChild(fragment);
    }
  }

}

export { BookmarkListView };
