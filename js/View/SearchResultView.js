'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { binIdx } from '../data/binIdx.js';
import { kjvIdx } from '../data/kjvIdx.js';
import { kjvLists } from '../data/kjvLists.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'search-lookup', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
  { type: 'btn', icon: 'strong-mode', ariaLabel: null },
];

const upperToolSet = [
  { type: 'btn-banner', cssModifier: 'search-result', text: 'Toogle Clipboard' },
];

const localBinIdx = 0;
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
    const kjvBin = this.rig.kjvBin;
    const bookIdx = this.searchFilter.bookIdx;
    const chapterIdx = this.searchFilter.chapterIdx;
    if (bookIdx === -1 && chapterIdx === -1) {
      this.filteredVerses = kjvBin[binIdx.kjvBinIdx.verses];
      this.wordCount = kjvBin[binIdx.kjvBinIdx.wordCount];
      this.verseCount = kjvBin[binIdx.kjvBinIdx.verseCount];
      this.citation = kjvLists.name;
    } else {
      const books = kjvBin[binIdx.kjvBinIdx.books];
      const bookBin = this.findBin(books, bookIdx);
      if (chapterIdx === -1) {
        this.filteredVerses = kjvBin[binIdx.kjvBinIdx.verses].slice(bookBin[binIdx.bookBinIdx.sliceStart], bookBin[binIdx.bookBinIdx.sliceEnd]);
        this.wordCount = bookBin[binIdx.bookBinIdx.wordCount];
        this.verseCount = bookBin[binIdx.bookBinIdx.verseCount];
        this.citation = kjvLists.books[bookIdx][kjvIdx.book.longName];
      } else {
        const chapters = bookBin[binIdx.bookBinIdx.chapters];
        const chapterBin = this.findBin(chapters, chapterIdx);
        this.filteredVerses = kjvBin[binIdx.kjvBinIdx.verses].slice(chapterBin[binIdx.chapterBinIdx.sliceStart], chapterBin[binIdx.chapterBinIdx.sliceEnd]);
        this.wordCount = chapterBin[binIdx.chapterBinIdx.wordCount];
        this.verseCount = chapterBin[binIdx.chapterBinIdx.verseCount];
        this.citation = kjvLists.chapters[chapterIdx][kjvIdx.chapter.name];
      }
    }
  }

  buildPage() {
    this.page = template.page('search-result');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('search-result');
    this.list = template.element('div', 'list', 'search-result', null, null);
    this.scroll.appendChild(this.list);

    this.loadMore = template.element('div', 'load-more', 'search-result', null, null);
    this.btnLoadMore = document.createElement('div');
    this.btnLoadMore.classList.add('btn-load-more');
    this.btnLoadMore.textContent = 'Load More';
    this.loadMore.appendChild(this.btnLoadMore);
    this.scroll.appendChild(this.loadMore);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildRefSpan(verseObj) {
    const refSpan = document.createElement('span');
    refSpan.classList.add('font--bold');
    refSpan.textContent = verseObj.v[kjvIdx.verse.citation] + ' ';
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
    const text = document.createTextNode(verseObj.v[kjvIdx.verse.text]);
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

  changeFontVariant() {
    if (this.lastFontVariant) {
      this.list.classList.remove(this.lastFontVariant);
    }
    this.list.classList.add(this.fontVariant);
  }

  clearResults() {
    this.btnBanner.classList.add('btn-banner--search-result-error');
    this.btnBanner.innerHTML = 'Query Error';
    util.removeAllChildren(this.list);
    this.loadMore.classList.add('hide');
  }

  filterUpdate(searchFilter) {
    this.searchFilter = searchFilter;
    if (this.rig) {
      if (this.rig.state === 'OK') {
        this.applyFilter();
      }
      this.updateBanner();
      this.updateResult();
    }
  }

  findBin(bins, idx) {
    return bins.find((bin) => {
      return bin[localBinIdx] === idx;
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

  fontVariantUpdate(fontVariant) {
    this.fontVariant = fontVariant;
    this.changeFontVariant();
    this.lastFontVariant = fontVariant;
  }

  getElements() {
    this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--search-result');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--search-lookup');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
    this.btnStrongMode = this.toolbarLower.querySelector('.btn-icon--strong-mode');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.rig = null;
    this.lastFont = null;
    this.lastFontSize = null;
    this.lastFontVariant = null;
    this.clipboardMode = false;
  }

  listClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      if (this.clipboardMode) {
        const text = btn.textContent;
        navigator.clipboard.writeText(text);
      } else {
        const verseIdx = parseInt(btn.dataset.verseIdx);
        if (this.strongMode) {
          queue.publish('search-result.strong-select', verseIdx);
        } else {
          queue.publish('search-result.read-select', verseIdx);
        }
      }
    }
  }

  loadMoreClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-load-more');
    if (btn) {
      if (btn === this.btnLoadMore) {
        this.loadVerses();
      }
    }
  }

  loadVerses() {
    let verses;
    if (this.verseCount <= loadIncrement) {
      verses = this.filteredVerses;
      this.loadIdx = this.verseCount;
    } else {
      const sliceEnd = Math.min(this.loadIdx + loadIncrement, this.verseCount);
      verses = this.filteredVerses.slice(this.loadIdx, sliceEnd);
      this.loadIdx = sliceEnd;
    }

    const fragment = document.createDocumentFragment();
    const verseObjs = this.searchVerseObjs.filter(x => verses.includes(x.k));
    for (const verseObj of verseObjs) {
      const verse = this.buildVerse(verseObj);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);

    if (this.loadIdx < this.verseCount) {
      this.loadMore.classList.remove('hide');
    } else {
      this.loadMore.classList.add('hide');
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

    queue.subscribe('font-variant.update', (fontVariant) => {
      this.fontVariantUpdate(fontVariant);
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
    queue.subscribe('search.query.error', () => {
      this.clearResults();
    });
    queue.subscribe('search.strong-mode.update', (strongMode) => {
      this.modeUpdate(strongMode);
    });
    queue.subscribe('search.verse-objs.update', (searchVerseObjs) => {
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
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('search.back', null);
      } else if (btn === this.btnLookup) {
        queue.publish('search-lookup', null);
      } else if (btn === this.btnFilter) {
        queue.publish('search-filter', null);
      } else if (btn === this.btnHistory) {
        queue.publish('search-history', null);
      } else if (btn === this.btnStrongMode) {
        queue.publish('search.strong-mode.click', null);
      }
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-banner');
    if (btn) {
      if (btn === this.btnBanner) {
        this.toogleClipboardMode();
      }
    }
  }

  updateBanner() {
    this.btnBanner.classList.remove('btn-banner--search-result-error');
    this.btnBanner.innerHTML = `${this.citation} ` +
      `(${this.wordCount}/${this.verseCount})<br>` +
      `${this.rig.query}`;
  }

  updateResult() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    if (
      this.rig !== null &&
      this.rig.state === 'OK'
    ) {
      this.loadIdx = 0;
      this.loadedVerses = 0;
      this.loadVerses();
    }
  }

  versesUpdate(searchVerseObjs) {
    this.searchVerseObjs = searchVerseObjs;
    this.updateResult();
  }

}

export { SearchResultView };
