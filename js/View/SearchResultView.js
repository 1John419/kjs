'use strict';

import {
  queue,
} from '../CommandQueue.js';
import {
  templateAcrostic,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper,
} from '../template.js';
import {
  removeAllChildren,
} from '../util.js';
import {
  bookBinChapters,
  bookBinSliceEnd,
  bookBinSliceStart,
  bookBinVerseCount,
  bookBinWordCount,
  chapterBinSliceEnd,
  chapterBinSliceStart,
  chapterBinVerseCount,
  chapterBinWordCount,
  tomeBinBooks,
  tomeBinVerseCount,
  tomeBinVerses,
  tomeBinWordCount,
} from '../data/binIdx.js';
import {
  tomeBooks,
  tomeChapters,
  tomeName,
} from '../data/tomeDb.js';
import {
  bookLongName,
  chapterName,
  verseCitation,
  verseText,
} from '../data/tomeIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  { type: 'btn', icon: 'search-lookup', ariaLabel: 'Search Lookup' },
  { type: 'btn', icon: 'filter', ariaLabel: 'Search Filter' },
  { type: 'btn', icon: 'history', ariaLabel: 'Search History' },
  { type: 'btn', icon: 'strong-mode', ariaLabel: 'Strong Mode' },
];

const upperToolSet = [
  { type: 'btn-banner', cssModifier: 'search-result', text: 'Toogle Clipboard' },
];

const binIdx = 0;
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
    this.toolbarUpper.addEventListener('click', (event) => {
      this.toolbarUpperClick(event);
    });
  }

  applyFilter() {
    let tomeBin = this.rig.tomeBin;
    let bookIdx = this.searchFilter.bookIdx;
    let chapterIdx = this.searchFilter.chapterIdx;
    if (bookIdx === -1 && chapterIdx === -1) {
      this.filteredVerses = tomeBin[tomeBinVerses];
      this.wordCount = tomeBin[tomeBinWordCount];
      this.verseCount = tomeBin[tomeBinVerseCount];
      this.citation = tomeName;
    } else {
      let books = tomeBin[tomeBinBooks];
      let bookBin = this.findBin(books, bookIdx);
      if (chapterIdx === -1) {
        this.filteredVerses = tomeBin[tomeBinVerses].slice(
          bookBin[bookBinSliceStart], bookBin[bookBinSliceEnd]);
        this.wordCount = bookBin[bookBinWordCount];
        this.verseCount = bookBin[bookBinVerseCount];
        this.citation = tomeBooks[bookIdx][bookLongName];
      } else {
        let chapters = bookBin[bookBinChapters];
        let chapterBin = this.findBin(chapters, chapterIdx);
        this.filteredVerses = tomeBin[tomeBinVerses].slice(
          chapterBin[chapterBinSliceStart], chapterBin[chapterBinSliceEnd]);
        this.wordCount = chapterBin[chapterBinWordCount];
        this.verseCount = chapterBin[chapterBinVerseCount];
        this.citation = tomeChapters[chapterIdx][chapterName];
      }
    }
  }

  buildPage() {
    this.page = templatePage('search-result');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('search-result');
    this.list = templateElement('div', 'list', 'search-result', null, null);
    this.scroll.appendChild(this.list);

    this.loadMore = templateElement('div', 'load-more', 'search-result', null, null);
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
        this.updateResult();
      }
    }
  }

  findBin(bins, idx) {
    return bins.find((bin) => {
      return bin[binIdx] === idx;
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
    this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--search-result');

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
    this.clipboardMode = false;
  }

  listClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (this.clipboardMode) {
      let text = btn.textContent;
      navigator.clipboard.writeText(text);
    } else {
      let verseIdx = parseInt(btn.dataset.verseIdx);
      if (this.strongMode) {
        queue.publish('search-result.strong-select', verseIdx);
      } else {
        queue.publish('search-result.read-select', verseIdx);
      }
    }
  }

  loadMoreClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn === this.btnLoadMore) {
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
    let verseObjs = this.searchVerseObjs.filter(x => verses.includes(x.k));
    for (let verseObj of verseObjs) {
      let verse = this.buildVerse(verseObj);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);

    if (this.loadIdx < this.verseCount) {
      this.loadMore.classList.remove('btn-load-more--hide');
    } else {
      this.loadMore.classList.add('btn-load-more--hide');
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
    queue.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });

    queue.subscribe('font-size.update', (fontSize) => {
      this.fontSizeUpdate(fontSize);
    });

    queue.subscribe('rig.update', (rig) => {
      this.rigUpdate(rig);
    });

    queue.subscribe('search-result.hide', () => {
      this.hide();
    });
    queue.subscribe('search-result.show', () => {
      this.show();
    });

    queue.subscribe('search.filter.update', (searchFilter) => {
      this.filterUpdate(searchFilter);
    });
    queue.subscribe('search.strong-mode.update', (strongMode) => {
      this.modeUpdate(strongMode);
    });
    queue.subscribe('search.verses.update', (searchVerseObjs) => {
      this.versesUpdate(searchVerseObjs);
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
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('search.back', null);
      } else if (btn === this.btnFilter) {
        queue.publish('search-filter', null);
      } else if (btn === this.btnHistory) {
        queue.publish('search-history', null);
      } else if (btn === this.btnStrongMode) {
        queue.publish('search.strong-mode.click', null);
      } else if (btn === this.btnSearchLookup) {
        queue.publish('search-lookup', null);
      }
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBanner) {
        this.toogleClipboardMode();
      }
    }
  }

  updateBanner() {
    this.btnBanner.innerHTML = `${this.citation} ` +
      `(${this.wordCount}/${this.verseCount})<br>` +
      `${this.rig.query}`;
  }

  updateResult() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.rig.state === 'OK') {
      this.loadIdx = 0;
      this.loadedVerses = 0;
      this.loadVerses();
    }
  }

  versesUpdate(searchVerseObjs) {
    this.searchVerseObjs = searchVerseObjs;
  }

}

export { SearchResultView };
