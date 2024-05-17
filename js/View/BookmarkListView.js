'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { tomeIdx } from '../data/tomeIdx.js';
import { tomeLists } from '../data/tomeLists.js';

const actionSet = [
  { icon: 'up', ariaLabel: null },
  { icon: 'down', ariaLabel: null },
  { icon: 'move-copy', ariaLabel: null },
  { icon: 'delete', ariaLabel: null },
  { icon: 'cancel', ariaLabel: null },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'sort-ascend', ariaLabel: null },
  { type: 'btn', icon: 'sort-invert', ariaLabel: null },
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
  { type: 'btn', icon: 'expand-mode', ariaLabel: null },
  { type: 'btn', icon: 'strong-mode', ariaLabel: null },
];

const upperToolSet = [
  { type: 'btn-banner', cssModifier: 'bookmark-list', ariaLbael: 'Toogle Clipboard' },
];

class BookmarkListView {

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
        const btnEntry = this.activeEntry.querySelector('.btn-entry');
        const verseIdx = parseInt(btnEntry.dataset.verseIdx);
        if (btn === this.btnUp) {
          this.up(verseIdx);
        } else if (btn === this.btnDown) {
          this.down(verseIdx);
        } else if (btn === this.btnMoveCopy) {
          this.moveCopy(verseIdx);
        } else if (btn === this.btnDelete) {
          this.delete(verseIdx);
        }
        this.actionMenu.classList.add('hide');
      }
    }
  }

  addListeners() {
    this.actionMenu.addEventListener('click', (event) => {
      this.actionMenuClick(event);
    });
    this.entryList.addEventListener('click', (event) => {
      this.entryListClick(event);
    });
    this.verseList.addEventListener('click', (event) => {
      this.verseListClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
    this.toolbarUpper.addEventListener('click', (event) => {
      this.toolbarUpperClick(event);
    });
  }

  buildEntry(verseIdx) {
    const entry = document.createElement('div');
    entry.classList.add('entry', 'entry--bookmark');
    const btnRef = document.createElement('div');
    btnRef.classList.add('btn-entry', 'btn-entry--bookmark');
    btnRef.textContent = tomeLists.citations[verseIdx];
    btnRef.dataset.verseIdx = verseIdx;
    entry.appendChild(btnRef);
    const btnMenu = template.btnIcon('h-menu', 'h-menu', null);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = template.page('bookmark-list');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-list');

    this.empty = template.element('div', 'empty', 'bookmark-list', null, 'No bookmarks saved.');
    this.scroll.appendChild(this.empty);

    this.entryList = template.element('div', 'list', 'bookmark-entry-list', null, null);
    this.scroll.appendChild(this.entryList);

    this.verseList = template.element('div', 'list', 'bookmark-verse-list', null, null);
    this.scroll.appendChild(this.verseList);

    this.actionMenu = template.actionMenu('bookmark-list', actionSet);
    this.scroll.appendChild(this.actionMenu);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildRefSpan(verseObj) {
    const refSpan = document.createElement('span');
    refSpan.classList.add('font--bold');
    refSpan.textContent = verseObj.v[tomeIdx.verse.citation] + ' ';
    return refSpan;
  }

  buildVerse(verseObj) {
    const btn = document.createElement('div');
    btn.classList.add('btn-result');
    btn.dataset.verseIdx = verseObj.k;
    const searchText = document.createElement('span');
    searchText.classList.add('span-result-text');
    const acrostic = template.acrostic(verseObj);
    const ref = this.buildRefSpan(verseObj);
    const text = document.createTextNode(verseObj.v[tomeIdx.verse.text]);
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
        const verseIdx = parseInt(target.dataset.verseIdx);
        if (this.strongMode) {
          queue.publish('bookmark-list.strong-select', verseIdx);
        } else {
          queue.publish('bookmark-list.select', verseIdx);
        }
      } else if (target.classList.contains('btn-icon--h-menu')) {
        const ref = target.previousSibling;
        this.menuClick(ref);
      }
    }
  }

  expandModeUpdate(expandMode) {
    this.expandMode = expandMode;
    if (this.expandMode) {
      this.verseScrollTop = this.scroll.scrollTop;
      this.btnExpandMode.classList.add('btn-icon--active');
      this.entryList.classList.add('hide');
      this.verseList.classList.remove('hide');
      this.scroll.scrollTop = this.entrySrollTop;
    } else {
      this.entrySrollTop = this.scroll.scrollTop;
      this.btnExpandMode.classList.remove('btn-icon--active');
      this.entryList.classList.remove('hide');
      this.verseList.classList.add('hide');
      this.scroll.scrollTop = this.verseScrollTop;
    }
  }

  fontSizeUpdate(fontSize) {
    this.fontSize = fontSize;
    this.updateFontSize();
    this.lastFontSize = this.fontSize;
  }

  fontUpdate(font) {
    this.font = font;
    this.updateFont();
    this.lastFont = this.font;
    this.lastFontSize = null;
  }

  fontVariantUpdate(fontVariant) {
    this.fontVariant = fontVariant;
    this.updateFontVariant();
    this.lastFontVariant = this.fontVariant;
  }

  getElements() {
    this.btnFolderAdd = this.toolbarUpper.querySelector('.btn-icon--folder-add');
    this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--bookmark-list');

    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnMoveCopy = this.actionMenu.querySelector('.btn-icon--move-copy');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnSortAscend = this.toolbarLower.querySelector('.btn-icon--sort-ascend');
    this.btnSortInvert = this.toolbarLower.querySelector('.btn-icon--sort-invert');
    this.btnExpandMode = this.toolbarLower.querySelector('.btn-icon--expand-mode');
    this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
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
    this.lastFont = null;
    this.clipboardMode = false;
    this.entrySrollTop = 0;
    this.verseScrollTop = 0;
  }

  entryListClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      this.entryClick(btn);
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
    this.activeEntry = target.closest('div.entry');
    const top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('hide');
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

    queue.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });

    queue.subscribe('font-size.update', (fontSize) => {
      this.fontSizeUpdate(fontSize);
    });

    queue.subscribe('font-variant.update', (fontVariant) => {
      this.fontVariantUpdate(fontVariant);
    });

    queue.subscribe('bookmark.verse-objs.update', (verseObjs) => {
      this.updateBookmarkVerseObjs(verseObjs);
    });
  }

  toogleClipboardMode() {
    if (this.clipboardMode) {
      this.btnBanner.classList.remove('btn-banner--active');
    } else {
      this.btnBanner.classList.add('btn-banner--active');
    }
    this.clipboardMode = !this.clipboardMode;
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('bookmark.back', null);
      } else if (btn === this.btnSortAscend) {
        queue.publish('bookmark-list.sort-ascend', null);
      } else if (btn === this.btnSortInvert) {
        queue.publish('bookmark-list.sort-invert', null);
      } else if (btn === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      } else if (btn === this.btnExpandMode) {
        queue.publish('bookmark-list.expand-mode.click', null);
      } else if (btn === this.btnStrongMode) {
        queue.publish('bookmark-list.strong-mode.click', null);
      }
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    if (!this.expandMode) {
      return;
    }
    const btn = event.target.closest('div.btn-banner');
    if (btn) {
      if (btn === this.btnBanner) {
        this.toogleClipboardMode();
      }
    }
  }

  up(verseIdx) {
    queue.publish('bookmark-list.up', verseIdx);
  }

  updateBanner() {
    this.btnBanner.innerHTML = `${this.activeFolder.name}`;
  }

  updateActiveFolder(activeFolder) {
    this.activeFolder = activeFolder;
    this.updateBanner();
    this.updateBookmarks();
  }

  updateBookmarks() {
    this.entrySrollTop = 0;
    this.updateEntryList();
    this.verseScrollTop = 0;
    this.updateVerseList();
  }

  updateBookmarkVerseObjs(verseObjs) {
    this.activeFolder.verseObjs = verseObjs;
    this.verseScrollTop = 0;
    this.updateVerseList();
  }

  updateEntryList() {
    util.removeAllChildren(this.entryList);
    if (this.activeFolder.bookmarks.length === 0) {
      this.empty.classList.remove('hide');
    } else {
      this.empty.classList.add('hide');
      const fragment = document.createDocumentFragment();
      for (const verseIdx of this.activeFolder.bookmarks) {
        const ref = this.buildEntry(verseIdx);
        fragment.appendChild(ref);
      }
      this.entryList.appendChild(fragment);
    }
  }

  updateFontSize() {
    if (this.lastFontSize) {
      this.verseList.classList.remove(this.lastFontSize);
    }
    this.verseList.classList.add(this.fontSize);
  }

  updateFontVariant() {
    if (this.lastFontVariant) {
      this.verseList.classList.remove(this.lastFontVariant);
    }
    this.verseList.classList.add(this.fontVariant);
  }

  updateFont() {
    if (this.lastFont) {
      this.verseList.classList.remove(this.lastFont.fontClass);
    }
    this.verseList.classList.add(this.font.fontClass);
  }

  updateVerseList() {
    util.removeAllChildren(this.verseList);
    if (this.activeFolder.bookmarks.length === 0) {
      this.empty.classList.remove('hide');
    } else {
      this.empty.classList.add('hide');
      const fragment = document.createDocumentFragment();
      for (const verseObj of this.activeFolder.verseObjs) {
        const ref = this.buildVerse(verseObj);
        fragment.appendChild(ref);
      }
      this.verseList.appendChild(fragment);
    }
  }

  verseClick(target) {
    if (target) {
      if (target.classList.contains('btn-result')) {
        if (this.clipboardMode) {
          const text = target.textContent;
          util.writeClipboardText(text);
        } else {
          const verseIdx = parseInt(target.dataset.verseIdx);
          if (this.strongMode) {
            queue.publish('bookmark-list.strong-select', verseIdx);
          } else {
            queue.publish('bookmark-list.select', verseIdx);
          }
        }
      }
    }
  }

  verseListClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      this.verseClick(btn);
    }
  }

}

export { BookmarkListView };
