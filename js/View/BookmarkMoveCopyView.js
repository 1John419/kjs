'use strict';

import { bus } from '../EventBus.js';
import { verseCitation } from '../data/tomeIdx.js';
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
  removeAllChildren
} from '../util.js';

const actionSet = [
  { icon: 'move', label: 'Move' },
  { icon: 'copy', label: 'Copy' },
  { icon: 'cancel', label: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', label: 'Bookmark Folder' },
];

const upperToolSet = [
  { type: 'banner', modifier: 'bookmark-move-copy', text: null }
];

class BookmarkMoveCopyView {

  constructor() {
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnCancel) {
        this.actionMenu.classList.add('action-menu--hide');
      } else {
        let entry = this.activeEntry.querySelector('.btn-entry');
        let folderName = entry.textContent;
        if (btn === this.btnCopy) {
          this.copy(folderName);
        } else if (btn === this.btnMove) {
          this.move(folderName);
        }
        this.actionMenu.classList.add('action-menu--hide');
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
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--bookmark-move-copy');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--bookmark-move-copy');
    btnEntry.textContent = folderName;
    let btnMenu = templateBtnIcon('menu', 'Menu');
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = templatePage('bookmark-move-copy');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('bookmark-move-copy');

    this.empty = templateElement('div', 'empty', 'bookmark-move-copy', null,
      'No Target Folder.');
    this.scroll.appendChild(this.empty);

    this.list = templateElement('div', 'list', 'bookmark-move-copy', null,
      null);
    this.scroll.appendChild(this.list);

    this.actionMenu = templateActionMenu('bookmark-move-copy', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  copy(folderName) {
    let copyPkg = {
      to: folderName,
      verseIdx: this.verseIdx
    };
    bus.publish('bookmark-move-copy.copy', copyPkg);
  }

  folderUpdate(bookmarksFolder) {
    this.bookmarksFolder = bookmarksFolder;
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector(
      '.banner--bookmark-move-copy');

    this.btnMove = this.actionMenu.querySelector('.btn-icon--move');
    this.btnCopy = this.actionMenu.querySelector('.btn-icon--copy');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

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
      if (target.classList.contains('btn-icon--menu')) {
        let entry = target.previousSibling;
        this.menuClick(entry);
      }
    }
  }

  listUpdate(moveCopyList) {
    this.moveCopyList = moveCopyList;
    this.updateList();
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  move(folderName) {
    let movePkg = {
      to: folderName,
      verseIdx: this.verseIdx
    };
    bus.publish('bookmark-move-copy.move', movePkg);
  }

  moveCopyUpdate(verseObj) {
    this.moveCopyVerseObj = verseObj;
    this.verseIdx = this.moveCopyVerseObj.k;
    this.verse = this.moveCopyVerseObj.v;
    bus.publish('bookmark-move-copy.ready', null);
  }

  scrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
    } else {
      this.scroll.scrollTop = 0;
    }
  }

  show() {
    this.updateBanner();
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
  }

  subscribe() {
    bus.subscribe('folder.update', (bookmarksFolder) => {
      this.folderUpdate(bookmarksFolder);
    });

    bus.subscribe('bookmark-move-copy.hide', () => {
      this.hide();
    });
    bus.subscribe('bookmark-move-copy.list.update', (moveCopyList) => {
      this.listUpdate(moveCopyList);
    });
    bus.subscribe('bookmark-move-copy.show', () => {
      this.show();
    });

    bus.subscribe('bookmark.move-copy.update', (verseObj) => {
      this.moveCopyUpdate(verseObj);
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

  updateBanner() {
    let ref = this.verse[verseCitation];
    this.banner.innerHTML = `${ref} <br> Move/Copy to Folder:`;
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.moveCopyList.length === 0) {
      this.empty.classList.remove('empty--hide');
    } else {
      this.empty.classList.add('empty--hide');
      let fragment = document.createDocumentFragment();
      for (let folderName of this.moveCopyList) {
        let entry = this.buildEntry(folderName);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
    }
  }

}

export { BookmarkMoveCopyView };
