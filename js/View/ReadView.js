'use strict';

import {
  queue,
} from '../CommandQueue.js';
import {
  templateAcrostic,
  templateElement,
  templateToolbarLower,
  templateToolbarMenu,
  templatePage,
  templateScroll,
  templateToolbarUpper,
} from '../template.js';
import {
  centerScrollElement,
  removeAllChildren,
  sideScrollElement,
} from '../util.js';
import {
  tomeChapters,
} from '../data/tomeDb.js';
import {
  chapterName,
  verseNum,
  verseText,
} from '../data/tomeIdx.js';
import {
  mapSliceEnd,
  mapSliceStart,
  mapStrongNums,
} from '../data/strongIdx.js';
import {
  elElyon,
  elShaddai,
  nameSub,
  yahweh,
} from '../data/name.js';

const lowerToolSet = [
  { type: 'btn', icon: 'navigator', ariaLabel: 'Navigator' },
  { type: 'btn', icon: 'bookmark', ariaLabel: 'Bookmark' },
  { type: 'btn', icon: 'search', ariaLabel: 'Search' },
  { type: 'btn', icon: 'strong', ariaLabel: 'Strong' },
  { type: 'btn', icon: 'setting', ariaLabel: 'Setting' },
  { type: 'btn', icon: 'help', ariaLabel: 'Help' },
  { type: 'btn', icon: 'column-mode', ariaLabel: 'Column Mode' },
  { type: 'btn', icon: 'name-mode', ariaLabel: 'Name Mode' },
  { type: 'btn', icon: 'strong-mode', ariaLabel: 'Strong Mode' },
  { type: 'btn', icon: 'v-menu', ariaLabel: 'Toolbar Menu' },
];

const upperToolSet = [
  { type: 'btn', icon: 'prev', ariaLabel: 'Previous Chapter' },
  { type: 'btn-banner', cssModifier: 'read', text: 'Toogle Clipboard' },
  { type: 'btn', icon: 'next', ariaLabel: 'Next Chapter' },
];

const menuSet = [
  { type: 'btn', icon: 'cancel', ariaLabel: 'Toolbar Menu' },
  { type: 'btn', icon: 'setting', ariaLabel: 'Setting' },
  { type: 'btn', icon: 'help', ariaLabel: 'Help' },
];

const matthewChapterIdx = 929;

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
    this.page = templatePage('read');
    this.page.classList.remove('page--hide');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('read');
    this.list = templateElement('div', 'list', 'read', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    this.toolbarMenu = templateToolbarMenu('read-menu', menuSet);
    this.page.appendChild(this.toolbarMenu);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildVerse(verseObj) {
    let verse = templateElement('div', 'verse', null, null, null);
    verse.dataset.verseIdx = verseObj.k;
    let verseNum = this.buildVerseNum(verseObj);
    verse.appendChild(verseNum);
    let acrostic = templateAcrostic(verseObj);
    if (acrostic) {
      verse.appendChild(acrostic);
    }
    let text = this.buildVerseText(verseObj);
    verse.appendChild(text);
    return verse;
  }

  buildVerseNum(verseObj) {
    let num = templateElement('span', 'verse-num', null, null,
      verseObj.v[verseNum] + ' ');
    return num;
  }

  buildVerseText(verseObj) {
    let text = templateElement('span', 'verse-text', null, null,
      this.getVerseText(verseObj));
    return text;
  }

  changeTheme() {
    if (this.lastTheme) {
      this.body.classList.remove(this.lastTheme.themeClass);
    }
    this.body.classList.add(this.theme.themeClass);
  }

  chapterIdxUpdate(chapterIdx) {
    this.chapterIdx = chapterIdx;
    this.setVerseText();
    this.updateBanner();
    this.updateVerses();
    this.refreshVerseBookmarks();
  }

  columnModeUpdate(columnMode) {
    this.columnMode = columnMode;
    this.updateColumnModeBtn();
    this.updateColumnMode();
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

  getKjvVerseText(verseObj) {
    return verseObj.v[verseText];
  }

  getNameVerseText(verseObj) {
    return this.nameSub(verseObj);
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
    this.clipboardMode = false;
  }

  listClick(event) {
    event.preventDefault();
    if (!document.getSelection().toString()) {
      let verse = event.target.closest('div.verse');
      if (verse) {
        if (this.clipboardMode) {
          let text = `${this.btnBanner.textContent}:${verse.textContent}`;
          navigator.clipboard.writeText(text);
        } else {
          this.verseClick(verse);
        }
      }
    }
  }

  nameModeUpdate(nameMode) {
    this.nameMode = nameMode;
    if (this.nameMode) {
      this.btnNameMode.classList.add('btn-icon--active');
    } else {
      this.btnNameMode.classList.remove('btn-icon--active');
    }
    this.setVerseText();
    if (this.verseObjs && this.chapterIdx < matthewChapterIdx) {
      this.updateVerses();
      this.refreshVerseBookmarks();
    }
  }

  nameSub(verseObj) {
    let verseIdx = verseObj.k;
    let rawWords = verseObj.v[verseText].split(' ');
    let fragments = [];
    let maps = this.mapObjs.find(x => x.k === verseIdx).v;
    for (let map of maps) {
      let fragment =
        rawWords.slice(map[mapSliceStart], map[mapSliceEnd]).join(' ');
      for (let number of map[mapStrongNums]) {
        if (number in nameSub) {
          let subMaps = nameSub[number];
          for (let subMap of subMaps) {
            if (fragment.includes(subMap[0])) {
              fragment = fragment.replaceAll(subMap[0], subMap[1]);
              break;
            }
          }
        }
      }
      fragments.push(fragment);
    }
    let revised = fragments.join(' ');
    if (elElyon.includes(verseIdx)) {
      revised = revised.replaceAll('Elyon El', 'El Elyon');
    }
    if (elShaddai.includes(verseIdx)) {
      revised = revised.replaceAll('Shaddai El', 'El Shaddai');
    }
    if (yahweh.includes(verseIdx)) {
      revised = revised.replaceAll('the Yahweh', 'Yahweh');
    }
    return revised;
  }

  navigatorHide() {
    this.btnNavigator.classList.remove('btn-icon--active');
  }

  navigatorShow() {
    this.btnNavigator.classList.add('btn-icon--active');
  }

  navigatorMapsUpdate(mapObjs) {
    this.mapObjs = mapObjs;
  }

  navigatorVersesUpdate(verseObjs) {
    this.verseObjs = verseObjs;
  }

  refreshBookmarks(element) {
    let verseIdx = parseInt(element.dataset.verseIdx);
    if (this.activeFolder.bookmarks.indexOf(verseIdx) === -1) {
      element.classList.remove('verse--bookmark');
    } else {
      element.classList.add('verse--bookmark');
    }
  }

  refreshVerseBookmarks() {
    let verses = [...this.list.querySelectorAll('.verse')];
    for (let element of verses) {
      this.refreshBookmarks(element);
    }
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
    this.scroll.scrollLeft = 0;
  }

  scrollToVerse(verseIdx) {
    let element = this.list.querySelector(
      `[data-verse-idx="${verseIdx}"]`);
    if (element) {
      if (this.columnMode) {
        sideScrollElement(this.scroll, element);
      } else {
        centerScrollElement(this.scroll, element);
      }
    }
  }

  searchHide() {
    if (this.sidebar !== 'search') {
      this.btnSearch.classList.remove('btn-icon--active');
    }
  }

  searchShow() {
    this.btnSearch.classList.add('btn-icon--active');
  }

  settingHide() {
    this.btnSetting.classList.remove('btn-icon--active');
  }

  settingShow() {
    this.btnSetting.classList.add('btn-icon--active');
  }

  setVerseText() {
    if (this.nameMode && this.chapterIdx < matthewChapterIdx) {
      this.getVerseText = this.getNameVerseText;
    } else {
      this.getVerseText = this.getKjvVerseText;
    }
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

    queue.subscribe('help.hide', () => {
      this.helpHide();
    });
    queue.subscribe('help.show', () => {
      this.helpShow();
    });

    queue.subscribe('navigator.hide', () => {
      this.navigatorHide();
    });
    queue.subscribe('navigator.show', () => {
      this.navigatorShow();
    });
    queue.subscribe('navigator.maps.update', (mapObjs) => {
      this.navigatorMapsUpdate(mapObjs);
    });
    queue.subscribe('navigator.verses.update', (verseObjs) => {
      this.navigatorVersesUpdate(verseObjs);
    });

    queue.subscribe('read.column-mode.update', (columnMode) => {
      this.columnModeUpdate(columnMode);
    });
    queue.subscribe('read.hide', () => {
      this.hide();
    });
    queue.subscribe('read.name-mode.update', (nameMode) => {
      this.nameModeUpdate(nameMode);
    });
    queue.subscribe('read.scroll-to-top', () => {
      this.scrollToTop();
    });
    queue.subscribe('read.scroll-to-verse', (verseIdx) => {
      this.scrollToVerse(verseIdx);
    });
    queue.subscribe('read.show', () => {
      this.show();
    });
    queue.subscribe('read.strong-mode.update', (strongMode) => {
      this.strongModeUpdate(strongMode);
    });

    queue.subscribe('search.hide', () => {
      this.searchHide();
    });
    queue.subscribe('search.show', () => {
      this.searchShow();
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
    let btn = event.target.closest('button');
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
    let btn = event.target.closest('button');
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

  toolbarUpperClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
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
    this.btnBanner.textContent = tomeChapters[this.chapterIdx][chapterName];
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

  updateFont() {
    if (this.lastFont) {
      this.list.classList.remove(this.lastFont.fontClass);
    }
    this.list.classList.add(this.font.fontClass);
  }

  updateFontSize() {
    if (this.lastFontSize) {
      this.list.classList.remove(this.lastFontSize);
    }
    this.list.classList.add(this.fontSize);
  }

  updateVerses() {
    removeAllChildren(this.list);
    let fragment = document.createDocumentFragment();
    for (let verseObj of this.verseObjs) {
      let verse = this.buildVerse(verseObj);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);
  }

  verseClick(verse) {
    let verseIdx = parseInt(verse.dataset.verseIdx);
    if (this.strongMode) {
      queue.publish('read.strong.select', verseIdx);
    } else if (verse.classList.contains('verse--bookmark')) {
      queue.publish('read.bookmark.delete', verseIdx);
    } else {
      queue.publish('read.bookmark.add', verseIdx);
    }
  }

}

export { ReadView };
