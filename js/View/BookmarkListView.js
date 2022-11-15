'use strict';

import { queue } from '../CommandQueue.js';
import {
  templateActionMenu,
  templateAcrostic,
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import { removeAllChildren } from '../util.js';
import { citationByVerseIdx } from '../data/tomeDb.js';
import {
  verseCitation,
  verseText
} from '../data/tomeIdx.js';

const actionSet = [
  { icon: 'up', ariaLabel: 'Up' },
  { icon: 'down', ariaLabel: 'Down' },
  { icon: 'move-copy', ariaLabel: 'Move/Copy' },
  { icon: 'delete', ariaLabel: 'Delete' },
  { icon: 'cancel', ariaLabel: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  { type: 'btn', icon: 'sort-ascend', ariaLabel: 'Sort Ascending' },
  { type: 'btn', icon: 'sort-invert', ariaLabel: 'Sort Invert' },
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: 'Bookmark Folder' },
  { type: 'btn', icon: 'expand-mode', ariaLabel: 'Expand Bookmarks' },
  { type: 'btn', icon: 'strong-mode', ariaLabel: 'Strong Mode' },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-list', text: null },
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
    let btnMenu = templateBtnIcon('h-menu', 'h-menu', 'Menu');
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

  buildRefSpan(verseObj) {
    let refSpan = document.createElement('span');
    refSpan.classList.add('font--bold');
    refSpan.textContent = verseObj.v[verseCitation] + ' ';
    return refSpan;
  }

  buildVerse(verseObj) {
    let btn = document.createElement('button');
    btn.classList.add('btn-result');
    btn.dataset.verseIdx = verseObj.k;
    let searchText = document.createElement('span');
    searchText.classList.add('span-result-text');
    let acrostic = templateAcrostic(verseObj);
    let ref = this.buildRefSpan(verseObj);
    let text = document.createTextNode(verseObj.v[verseText]);
    searchText.appendChild(ref);
    if (acrostic) {
      searchText.appendChild(acrostic);
    }
    searchText.appendChild(text);
    btn.appendChild(searchText);
    return btn;
  }

  delete(verseIdx) {
    queue.publish('bookmark-list.delete', verseIdx);
  }

  down(verseIdx) {
    queue.publish('bookmark-list.down', verseIdx);
  }

  entryClick(target) {
    if (target) {
      if (target.classList.contains('btn-entry')) {
        let verseIdx = parseInt(target.dataset.verseIdx);
        if (this.strongMode) {
          queue.publish('bookmark-list.strong-select', verseIdx);
        } else {
          queue.publish('bookmark-list.select', verseIdx);
        }
      } else if (target.classList.contains('btn-icon--h-menu')) {
        let ref = target.previousSibling;
        this.menuClick(ref);
      }
    }
  }

  expandModeUpdate(expandMode) {
    this.expandMode = expandMode;
    if (this.expandMode) {
      this.btnExpandMode.classList.add('btn-icon--active');
    } else {
      this.btnExpandMode.classList.remove('btn-icon--active');
    }
    this.updateBookmarks()
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
    this.btnExpandMode = this.toolbarLower.querySelector(
      '.btn-icon--expand-mode');
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
    if (this.expandMode) {
      this.verseClick(target);
    } else {
      this.entryClick(target);
    }
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  moveCopy(verseIdx) {
    queue.publish('bookmark-list.move-copy', verseIdx);
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
    queue.subscribe('bookmark-folder.select', () => {
      this.scroll.scrollTop = 0;
    });

    queue.subscribe('bookmark-list.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-list.show', () => {
      this.show();
    });

    queue.subscribe('bookmark.active-folder.update', (activeFolder) => {
      this.updateActiveFolder(activeFolder);
    });
    queue.subscribe('bookmark.expand-mode.update', (expandMode) => {
      this.expandModeUpdate(expandMode);
    });
    queue.subscribe('bookmark.strong-mode.update', (strongMode) => {
      this.strongModeUpdate(strongMode);
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
      } else if (target === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      } else if (target === this.btnExpandMode) {
        queue.publish('bookmark-list.expand-mode.click', null);
      } else if (target === this.btnStrongMode) {
        queue.publish('bookmark-list.strong-mode.click', null);
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
    let scrollSave = this.scroll.scrollTop;
    removeAllChildren(this.list);
    if (this.activeFolder.bookmarks.length === 0) {
      this.empty.classList.remove('empty--hide');
    } else {
      this.empty.classList.add('empty--hide');
      let fragment = document.createDocumentFragment();
      if (this.expandMode) {
        for (let verseObj of this.activeFolder.verseObjs) {
          let ref = this.buildVerse(verseObj);
          fragment.appendChild(ref);
        }
      } else {
        for (let verseIdx of this.activeFolder.bookmarks) {
          let ref = this.buildEntry(verseIdx);
          fragment.appendChild(ref);
        }
      }
      this.list.appendChild(fragment);
    }
    this.scroll.scrollTop = scrollSave;
  }

  verseClick(target) {
    if (target) {
      if (target.classList.contains('btn-result')) {
        let verseIdx = parseInt(target.dataset.verseIdx);
        if (this.strongMode) {
          queue.publish('bookmark-list.strong-select', verseIdx);
        } else {
          queue.publish('bookmark-list.select', verseIdx);
        }
      }
    }
  }

}

export { BookmarkListView };
