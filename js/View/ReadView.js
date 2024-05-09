'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { kjvIdx } from '../data/kjvIdx.js';
import { kjvLists } from '../data/kjvLists.js';
import { dbNameMode } from '../Model/DbModel.js';

const lowerToolSet = [
  { type: 'btn', icon: 'navigator', ariaLabel: null },
  { type: 'btn', icon: 'bookmark', ariaLabel: null },
  { type: 'btn', icon: 'search', ariaLabel: null },
  { type: 'btn', icon: 'strong', ariaLabel: null },
  { type: 'btn', icon: 'setting', ariaLabel: null },
  { type: 'btn', icon: 'help', ariaLabel: null },
  { type: 'btn', icon: 'column-mode', ariaLabel: null },
  { type: 'btn', icon: 'name-mode', ariaLabel: null },
  { type: 'btn', icon: 'strong-mode', ariaLabel: null },
  { type: 'btn', icon: 'v-menu', ariaLabel: null },
];

const upperToolSet = [
  { type: 'btn', icon: 'prev', ariaLabel: null },
  { type: 'btn-banner', cssModifier: 'read', text: 'Toogle Clipboard' },
  { type: 'btn', icon: 'next', ariaLabel: null },
];

const menuSet = [
  { type: 'btn', icon: 'cancel', ariaLabel: null },
  { type: 'btn', icon: 'setting', ariaLabel: null },
  { type: 'btn', icon: 'help', ariaLabel: null },
];

class ReadView {

  constructor() {
    this.initialize();
  }

  activeFolderUpdate(activeFolder) {
    this.activeFolder = activeFolder;
    this.refreshVerseBookmarks();
  }

  addListeners() {
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.toolbarMenu.addEventListener('click', (event) => {
      this.toolbarMenuClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
    this.toolbarUpper.addEventListener('click', (event) => {
      this.toolbarUpperClick(event);
    });
  }

  bookmarkHide() {
    if (this.sidebar !== 'bookmark') {
      this.btnBookmark.classList.remove('btn-icon--active');
    }
  }

  bookmarkShow() {
    this.btnBookmark.classList.add('btn-icon--active');
  }

  buildPage() {
    this.page = template.page('read');
    this.page.classList.remove('page--hide');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('read');
    this.list = template.element('div', 'list', 'read', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    this.toolbarMenu = template.toolbarMenu('read-menu', menuSet);
    this.page.appendChild(this.toolbarMenu);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildVerse(verseObj) {
    const verse = document.createElement('div');
    verse.classList.add('btn-verse');
    verse.dataset.verseIdx = verseObj.k;
    const verseNum = this.buildVerseNum(verseObj);
    verse.appendChild(verseNum);
    const acrostic = template.acrostic(verseObj);
    if (acrostic) {
      verse.appendChild(acrostic);
    }
    const text = template.element('span', 'verse-text', null, null, verseObj.v[kjvIdx.verse.text]);
    verse.appendChild(text);
    return verse;
  }

  buildVerseNum(verseObj) {
    const num = template.element('span', 'verse-num', null, null, verseObj.v[kjvIdx.verse.num] + ' ');
    return num;
  }

  changeFont() {
    if (this.lastFont) {
      this.list.classList.remove(this.lastFont.fontClass);
    }
    this.list.classList.add(this.font.fontClass);
  }

  changeFontSize() {
    if (this.lastFontSize) {
      this.list.classList.remove(this.lastFontSize);
    }
    this.list.classList.add(this.fontSize);
  }

  changeFontVariant() {
    if (this.lastFontVariant) {
      this.list.classList.remove(this.lastFontVariant);
    }
    this.list.classList.add(this.fontVariant);
  }

  changeTheme() {
    if (this.lastTheme) {
      this.body.classList.remove(this.lastTheme.themeClass);
    }
    this.body.classList.add(this.theme.themeClass);
  }

  chapterIdxUpdate(chapterIdx) {
    this.chapterIdx = chapterIdx;
  }

  columnModeUpdate(columnMode) {
    this.columnMode = columnMode;
    this.updateColumnModeBtn();
    this.updateColumnMode();
  }

  fontUpdate(font) {
    this.font = font;
    this.changeFont();
    this.lastFont = this.font;
  }

  fontSizeUpdate(fontSize) {
    this.fontSize = fontSize;
    this.changeFontSize();
    this.lastFontSize = this.fontSize;
  }

  fontVariantUpdate(fontVariant) {
    this.fontVariant = fontVariant;
    this.changeFontVariant();
    this.lastFontVariant = this.fontVariant;
  }

  getElements() {
    this.body = document.querySelector('body');

    this.btnPrev = this.toolbarUpper.querySelector('.btn-icon--prev');
    this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--read');
    this.btnNext = this.toolbarUpper.querySelector('.btn-icon--next');

    this.btnNavigator = this.toolbarLower.querySelector('.btn-icon--navigator');
    this.btnBookmark = this.toolbarLower.querySelector('.btn-icon--bookmark');
    this.btnSearch = this.toolbarLower.querySelector('.btn-icon--search');
    this.btnStrong = this.toolbarLower.querySelector('.btn-icon--strong');
    this.btnSetting = this.toolbarLower.querySelector('.btn-icon--setting');
    this.btnHelp = this.toolbarLower.querySelector('.btn-icon--help');
    this.btnColumnMode = this.toolbarLower.querySelector('.btn-icon--column-mode');
    this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
    this.btnNameMode = this.toolbarLower.querySelector('.btn-icon--name-mode');
    this.btnMenu = this.toolbarLower.querySelector('.btn-icon--v-menu');

    this.btnMenuCancel = this.toolbarMenu.querySelector('.btn-icon--read-menu-cancel');
    this.btnMenuSetting = this.toolbarMenu.querySelector('.btn-icon--read-menu-setting');
    this.btnMenuHelp = this.toolbarMenu.querySelector('.btn-icon--read-menu-help');
  }

  helpHide() {
    if (this.sidebar !== 'help') {
      this.btnHelp.classList.remove('btn-icon--active');
    }
  }

  helpShow() {
    this.btnHelp.classList.add('btn-icon--active');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  hideToolbarMenu() {
    this.toolbarMenu.classList.add('toolbar-menu--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
    this.lastFontVariant = null;
    this.clipboardMode = false;
    this.scrollVerseIdx = null;
  }

  listClick(event) {
    event.preventDefault();
    if (!document.getSelection().toString()) {
      const btnVerse = event.target.closest('div.btn-verse');
      if (btnVerse) {
        if (this.clipboardMode) {
          const text = `${this.btnBanner.textContent}:${btnVerse.textContent}`;
          navigator.clipboard.writeText(text);
        } else {
          this.verseClick(btnVerse);
        }
      }
    }
  }

  nameModeUpdate() {
    this.setBtnNameMode();
  }

  navigatorHide() {
    this.btnNavigator.classList.remove('btn-icon--active');
  }

  navigatorShow() {
    this.btnNavigator.classList.add('btn-icon--active');
  }

  refreshBookmarks(element) {
    const verseIdx = parseInt(element.dataset.verseIdx);
    if (this.activeFolder.bookmarks.indexOf(verseIdx) === -1) {
      element.classList.remove('verse--bookmark');
    } else {
      element.classList.add('verse--bookmark');
    }
  }

  refreshVerseBookmarks() {
    const verses = [...this.list.querySelectorAll('.btn-verse')];
    for (const element of verses) {
      this.refreshBookmarks(element);
    }
  }

  scrollToVerse() {
    const element = this.list.querySelector(`[data-verse-idx="${this.scrollVerseIdx}"]`);
    if (element) {
      if (this.columnMode) {
        util.sideScrollElement(this.scroll, element);
      } else {
        util.centerScrollElement(this.scroll, element);
      }
    }
  }

  scrollVerseIdxUpdate(verseIdx) {
    this.scrollVerseIdx = verseIdx;
  }

  searchHide() {
    if (this.sidebar !== 'search') {
      this.btnSearch.classList.remove('btn-icon--active');
    }
  }

  searchShow() {
    this.btnSearch.classList.add('btn-icon--active');
  }

  setBtnNameMode() {
    if (dbNameMode) {
      this.btnNameMode.classList.add('btn-icon--active');
    } else {
      this.btnNameMode.classList.remove('btn-icon--active');
    }
  }

  settingHide() {
    this.btnSetting.classList.remove('btn-icon--active');
  }

  settingShow() {
    this.btnSetting.classList.add('btn-icon--active');
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  showToolbarMenu() {
    this.toolbarMenu.classList.remove('toolbar-menu--hide');
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  strongHide() {
    if (this.sidebar !== 'strong') {
      this.btnStrong.classList.remove('btn-icon--active');
    }
  }

  strongModeUpdate(strongMode) {
    this.strongMode = strongMode;
    if (this.strongMode) {
      this.btnStrongMode.classList.add('btn-icon--active');
    } else {
      this.btnStrongMode.classList.remove('btn-icon--active');
    }
  }

  strongShow() {
    this.btnStrong.classList.add('btn-icon--active');
  }

  subscribe() {
    queue.subscribe('bookmark.active-folder.update', (activeFolder) => {
      this.activeFolderUpdate(activeFolder);
    });
    queue.subscribe('bookmark.hide', () => {
      this.bookmarkHide();
    });
    queue.subscribe('bookmark.show', () => {
      this.bookmarkShow();
    });

    queue.subscribe('chapterIdx.update', (chapterIdx) => {
      this.chapterIdxUpdate(chapterIdx);
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

    queue.subscribe('help.hide', () => {
      this.helpHide();
    });
    queue.subscribe('help.show', () => {
      this.helpShow();
    });

    queue.subscribe('name-mode.update', () => {
      this.nameModeUpdate();
    });

    queue.subscribe('navigator.hide', () => {
      this.navigatorHide();
    });
    queue.subscribe('navigator.show', () => {
      this.navigatorShow();
    });

    queue.subscribe('read.column-mode.update', (columnMode) => {
      this.columnModeUpdate(columnMode);
    });
    queue.subscribe('read.hide', () => {
      this.hide();
    });
    queue.subscribe('read.scroll-verse-idx', (verseIdx) => {
      this.scrollVerseIdxUpdate(verseIdx);
    });
    queue.subscribe('read.show', () => {
      this.show();
    });
    queue.subscribe('read.strong-mode.update', (strongMode) => {
      this.strongModeUpdate(strongMode);
    });
    queue.subscribe('read.verse-objs.update', (verseObjs) => {
      this.verseObjsUpdate(verseObjs);
    });

    queue.subscribe('search.hide', () => {
      this.searchHide();
    });
    queue.subscribe('search.show', () => {
      this.searchShow();
    });

    queue.subscribe('set.name-mode-btn', () => {
      this.setBtnNameMode();
    });

    queue.subscribe('setting.hide', () => {
      this.settingHide();
    });
    queue.subscribe('setting.show', () => {
      this.settingShow();
    });

    queue.subscribe('strong.hide', () => {
      this.strongHide();
    });
    queue.subscribe('strong.show', () => {
      this.strongShow();
    });

    queue.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });

    queue.subscribe('theme.update', (theme) => {
      this.themeUpdate(theme);
    });
  }

  themeUpdate(theme) {
    this.theme = theme;
    this.changeTheme();
    this.lastTheme = this.theme;
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
      if (btn === this.btnStrongMode ||
        btn === this.btnNameMode ||
        btn === this.btnColumnMode ||
        !btn.classList.contains('btn-icon--active')
      ) {
        if (btn === this.btnNavigator) {
          queue.publish('sidebar.select', 'navigator');
        } else if (btn === this.btnBookmark) {
          queue.publish('sidebar.select', 'bookmark');
        } else if (btn === this.btnSearch) {
          queue.publish('sidebar.select', 'search');
        } else if (btn === this.btnStrong) {
          queue.publish('sidebar.select', 'strong');
        } else if (btn === this.btnSetting) {
          queue.publish('sidebar.select', 'setting');
        } else if (btn === this.btnHelp) {
          queue.publish('sidebar.select', 'help');
        } else if (btn === this.btnColumnMode) {
          queue.publish('read.column-mode.click', null);
        } else if (btn === this.btnStrongMode) {
          queue.publish('read.strong-mode.click', null);
        } else if (btn === this.btnNameMode) {
          queue.publish('read.name-mode.click', null);
        } else if (btn === this.btnMenu) {
          this.showToolbarMenu();
        }
      }
    }
  }

  toolbarMenuClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnCancel) {
        this.hideToolbarMenu();
      } else {
        if (btn === this.btnMenuSetting) {
          queue.publish('sidebar.select', 'setting');
        } else if (btn === this.btnMenuHelp) {
          queue.publish('sidebar.select', 'help');
        }
        this.hideToolbarMenu();
      }
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      if (btn === this.btnBanner) {
        this.toogleClipboardMode();
      } else if (btn === this.btnPrev) {
        queue.publish('read.prev.chapter', 1);
      } else if (btn === this.btnNext) {
        queue.publish('read.next.chapter', 2);
      }
    }
  }

  updateBanner() {
    this.btnBanner.textContent = kjvLists.chapters[this.chapterIdx][kjvIdx.chapter.name];
  }

  updateColumnMode() {
    if (this.columnMode) {
      this.list.classList.add('list--read-column');
    } else {
      this.list.classList.remove('list--read-column');
    }
  }

  updateColumnModeBtn() {
    if (this.columnMode) {
      this.btnColumnMode.classList.add('btn-icon--active');
    } else {
      this.btnColumnMode.classList.remove('btn-icon--active');
    }
  }

  updateVerses() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    const fragment = document.createDocumentFragment();
    for (const verseObj of this.verseObjs) {
      const verse = this.buildVerse(verseObj);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);
  }

  verseClick(btnVerse) {
    const verseIdx = parseInt(btnVerse.dataset.verseIdx);
    if (this.strongMode) {
      queue.publish('read.strong.select', verseIdx);
    } else if (btnVerse.classList.contains('verse--bookmark')) {
      queue.publish('read.bookmark.delete', verseIdx);
    } else {
      queue.publish('read.bookmark.add', verseIdx);
    }
  }

  verseObjsUpdate(verseObjs) {
    this.verseObjs = verseObjs;
    this.updateBanner();
    this.updateVerses();
    this.refreshVerseBookmarks();
    this.scrollToVerse(this.scrollVerseIdx);
  }

}

export { ReadView };
