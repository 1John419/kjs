'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  getBookName,
  getChapterName,
  getRefName,
  removeAllChildren
} from '../util.js';

import {
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'filter', label: 'Search Filter' },
  { type: 'btn', icon: 'history', label: 'Search History' },
  { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' },
  { type: 'btn', icon: 'search-lookup', label: 'Search Lookup' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'search-result', text: null }
];

const loadIncrement = 50;

class SearchResultView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.loadMore.addEventListener('click', (event) => {
      this.loadMoreClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  addVerse(verseIdx) {
    let btn = document.createElement('button');
    btn.classList.add('btn-result');
    btn.dataset.verseIdx = verseIdx;
    let searchText = document.createElement('span');
    searchText.classList.add('span-result-text');
    let acrostic = this.buildAcrosticSpan(verseIdx);
    let ref = this.buildRefSpan(verseIdx);
    let text = document.createTextNode(tome.verses[verseIdx]);
    searchText.appendChild(ref);
    if (acrostic) {
      searchText.appendChild(acrostic);
    }
    searchText.appendChild(text);
    btn.appendChild(searchText);
    return btn;
  }

  applyFilter() {
    let tomeBin = this.rig.tomeBin;
    let bookIdx = this.searchFilter.bookIdx;
    let chapterIdx = this.searchFilter.chapterIdx;
    if (bookIdx === -1 && chapterIdx === -1) {
      this.filteredVerses = tomeBin[3];
      this.wordCount = tomeBin[0];
      this.verseCount = tomeBin[1];
      this.citation = tome.name;
    } else {
      let books = tomeBin[2];
      let bookBin = this.findBin(books, bookIdx);
      if (chapterIdx === -1) {
        this.filteredVerses = tomeBin[3].slice(bookBin[3], bookBin[4]);
        this.wordCount = bookBin[1];
        this.verseCount = bookBin[2];
        this.citation = getBookName(bookIdx);
      } else {
        let chapters = bookBin[5];
        let chapterBin = this.findBin(chapters, chapterIdx);
        this.filteredVerses = tomeBin[3].slice(chapterBin[3],
          chapterBin[4]);
        this.wordCount = chapterBin[1];
        this.verseCount = chapterBin[2];
        this.citation = getChapterName(chapterIdx);
      }
    }
  }

  buildAcrosticSpan(verseIdx) {
    let acrosticSpan = undefined;
    let acrostics = tome.acrostics;
    if (acrostics) {
      let acrostic = acrostics[verseIdx];
      if (acrostic) {
        acrosticSpan = document.createElement('span');
        acrosticSpan.classList.add('verse-acrostic');
        acrosticSpan.textContent = acrostic;
      }
    }
    return acrosticSpan;
  }

  buildPage() {
    this.page = templatePage('search-result');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('search-result');
    this.list = templateElement('div', 'list', 'search-result', null, null);
    this.scroll.appendChild(this.list);

    this.loadMore = templateElement('div', 'load-more', 'strong-result', null, null);
    this.btnLoadMore = document.createElement('button');
    this.btnLoadMore.classList.add('btn-load-more');
    this.btnLoadMore.textContent = 'Load More';
    this.loadMore.appendChild(this.btnLoadMore);
    this.scroll.appendChild(this.loadMore);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildRefSpan(verseIdx) {
    let refSpan = document.createElement('span');
    refSpan.classList.add('verse-ref');
    refSpan.textContent = getRefName(verseIdx);
    return refSpan;
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

  filterUpdate(searchFilter) {
    this.searchFilter = searchFilter;
    if (this.rig) {
      if (this.rig.state === 'OK') {
        this.applyFilter();
        this.updateBanner();
        this.updateList();
      }
    }
  }

  findBin(bins, idx) {
    return bins.find((bin) => {
      return bin[0] === idx;
    });
  }

  fontUpdate(font) {
    if (this.font) {
      this.lastFont = this.font;
    }
    this.font = font;
    this.changeFont();
  }

  fontSizeUpdate(fontSize) {
    if (this.fontSize) {
      this.lastFontSize = this.fontSize;
    }
    this.fontSize = fontSize;
    this.changeFontSize();
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--search-result');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnFilter = this.toolbarLower.querySelector(
      '.btn-icon--filter');
    this.btnHistory = this.toolbarLower.querySelector(
      '.btn-icon--history');
    this.btnStrongMode = this.toolbarLower.querySelector(
      '.btn-icon--strong-mode');
    this.btnSearchLookup = this.toolbarLower.querySelector(
      '.btn-icon--search-lookup');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target;
    let btn = target.closest('button');
    let verseIdx = parseInt(btn.dataset.verseIdx);
    if (this.strongMode) {
      bus.publish('search-result.strong-select', verseIdx);
    } else {
      bus.publish('search-result.read-select', verseIdx);
    }
  }

  loadMoreClick(event) {
    event.preventDefault();
    let target = event.target;
    if (target === this.btnLoadMore) {
      this.loadVerses();
    }
  }

  loadVerses() {
    let verses;
    if (this.verseCount <= loadIncrement) {
      verses = this.filteredVerses;
      this.loadIdx = this.verseCount;
    } else {
      let sliceEnd = Math.min(this.loadIdx + loadIncrement, this.verseCount);
      verses = this.filteredVerses.slice(this.loadIdx, sliceEnd);
      this.loadIdx = sliceEnd;
    }

    let fragment = document.createDocumentFragment();
    for (let idx of verses) {
      let verse = this.addVerse(idx);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);

    if (this.loadIdx < this.verseCount) {
      this.loadMore.classList.remove('load--hide');
    } else {
      this.loadMore.classList.add('load--hide');
    }
  }

  modeUpdate(strongMode) {
    this.strongMode = strongMode;
    if (this.strongMode) {
      this.btnStrongMode.classList.add('btn-icon--active');
    } else {
      this.btnStrongMode.classList.remove('btn-icon--active');
    }
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  rigUpdate(rig) {
    this.rig = rig;
    this.query = this.rig.query;
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    bus.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });

    bus.subscribe('font-size.update', (fontSize) => {
      this.fontSizeUpdate(fontSize);
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('rig.update', (rig) => {
      this.rigUpdate(rig);
    });

    bus.subscribe('search-result.hide', () => {
      this.hide();
    });
    bus.subscribe('search-result.show', () => {
      this.show();
    });

    bus.subscribe('search.filter.update', (searchFilter) => {
      this.filterUpdate(searchFilter);
    });

    bus.subscribe('search.strong.mode.update', (strongMode) => {
      this.modeUpdate(strongMode);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        bus.publish('search.back', null);
      } else if (target === this.btnFilter) {
        bus.publish('search-filter', null);
      } else if (target === this.btnHistory) {
        bus.publish('search-history', null);
      } else if (target === this.btnStrongMode) {
        bus.publish('search.strong.mode.click', null);
      } else if (target === this.btnSearchLookup) {
        bus.publish('search-lookup', null);
      }
    }
  }

  updateBanner() {
    this.banner.innerHTML = `${this.citation} ` +
      `(${this.wordCount}/${this.verseCount})<br>` +
      `${this.rig.query}`;
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.rig.state === 'OK') {
      this.loadIdx = 0;
      this.loadedVerses = 0;
      this.loadVerses();
    }
  }

}

export { SearchResultView };
