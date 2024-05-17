'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { tomeIdx } from '../data/tomeIdx.js';

const actionSet = [
  { icon: 'move', ariaLabel: null },
  { icon: 'copy', ariaLabel: null },
  { icon: 'cancel', ariaLabel: null },
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-move-copy', text: null },
];

class BookmarkMoveCopyView {

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
        if (btn === this.btnCopy) {
          this.copy(folderName);
        } else if (btn === this.btnMove) {
          this.move(folderName);
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
    entry.classList.add('entry', 'entry--bookmark-move-copy');
    const btnEntry = document.createElement('div');
    btnEntry.classList.add('btn-entry', 'btn-entry--bookmark-move-copy');
    btnEntry.textContent = folderName;
    const btnMenu = template.btnIcon('h-menu', 'h-menu', null);
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = template.page('bookmark-move-copy');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-move-copy');

    this.empty = template.element('div', 'empty', 'bookmark-move-copy', null, 'No Target Folder');
    this.scroll.appendChild(this.empty);

    this.list = template.element('div', 'list', 'bookmark-move-copy', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = template.actionMenu('bookmark-move-copy', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  copy(folderName) {
    const copyPkg = {
      to: folderName,
      verseIdx: this.verseIdx,
    };
    queue.publish('bookmark-move-copy.copy', copyPkg);
  }

  folderUpdate(bookmarksFolder) {
    this.bookmarksFolder = bookmarksFolder;
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--bookmark-move-copy');

    this.btnMove = this.actionMenu.querySelector('.btn-icon--move');
    this.btnCopy = this.actionMenu.querySelector('.btn-icon--copy');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
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
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn.classList.contains('btn-icon--h-menu')) {
        const entry = btn.previousSibling;
        this.menuClick(entry);
      }
    }
  }

  listUpdate(moveCopyList) {
    this.moveCopyList = moveCopyList;
    this.updateFolders();
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  move(folderName) {
    const movePkg = {
      to: folderName,
      verseIdx: this.verseIdx,
    };
    queue.publish('bookmark-move-copy.move', movePkg);
  }

  moveCopyUpdate(verseObj) {
    this.moveCopyVerseObj = verseObj;
    this.verseIdx = this.moveCopyVerseObj.k;
    this.verse = this.moveCopyVerseObj.v;
    queue.publish('bookmark-move-copy.ready', null);
  }

  show() {
    this.updateBanner();
    this.page.classList.remove('page--hide');
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div.entry');
    const top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('hide');
  }

  subscribe() {
    queue.subscribe('bookmark.active-folder.update', (bookmarksFolder) => {
      this.folderUpdate(bookmarksFolder);
    });

    queue.subscribe('bookmark-move-copy.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-move-copy.list.update', (moveCopyList) => {
      this.listUpdate(moveCopyList);
    });
    queue.subscribe('bookmark-move-copy.show', () => {
      this.show();
    });

    queue.subscribe('bookmark.move-copy.update', (verseObj) => {
      this.moveCopyUpdate(verseObj);
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

  updateBanner() {
    const ref = this.verse[tomeIdx.verse.citation];
    this.banner.innerHTML = `${ref} <br> Move/Copy to Folder:`;
  }

  updateFolders() {
    const scrollSave = this.scroll.scrollTop;
    util.removeAllChildren(this.list);
    if (this.moveCopyList.length === 0) {
      this.empty.classList.remove('hide');
    } else {
      this.empty.classList.add('hide');
      const fragment = document.createDocumentFragment();
      for (const folderName of this.moveCopyList) {
        const entry = this.buildEntry(folderName);
        fragment.appendChild(entry);
      }
      this.list.appendChild(fragment);
    }
    this.scroll.scrollTop = scrollSave;
  }

}

export { BookmarkMoveCopyView };
