'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { binIdx } from '../data/binIdx.js';
import { kjvIdx } from '../data/kjvIdx.js';
import { kjvLists } from '../data/kjvLists.js';
import { strongIdx } from '../data/strongIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
  { type: 'btn', icon: 'strong-def', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
  { type: 'btn', icon: 'strong-verse', ariaLabel: null },
  { type: 'btn', icon: 'strong-mode', ariaLabel: null },
];

const upperToolSet = [
  { type: 'btn-banner', cssModifier: 'strong-result', text: 'Strong Search' },
];

const localBinIdx = 0;
const loadIncrement = 50;

class StrongResultView {

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

  addVerse(verseObj) {
    const btn = document.createElement('div');
    btn.classList.add('btn-result');
    btn.dataset.verseIdx = verseObj.k;
    const resultText = document.createElement('span');
    resultText.classList.add('span-search-text');
    const acrostic = template.acrostic(verseObj);
    const ref = this.buildRefSpan(verseObj);
    resultText.appendChild(ref);
    if (acrostic) {
      resultText.appendChild(acrostic);
    }
    const text = this.buildStrongText(verseObj);
    resultText.insertAdjacentHTML('beforeend', text);
    btn.appendChild(resultText);
    return btn;
  }

  applyFilter() {
    if (this.strongwordKjvBin.length) {
      const kjvBin = this.strongwordKjvBin;
      const bookIdx = this.strongFilter.bookIdx;
      const chapterIdx = this.strongFilter.chapterIdx;
      if (bookIdx === -1 && chapterIdx === -1) {
        this.filteredVerses = kjvBin[binIdx.kjvBinIdx.verses];
        this.wordCount = kjvBin[binIdx.kjvBinIdx.wordCount];
        this.verseCount = kjvBin[binIdx.kjvBinIdx.verseCount];
        this.citation = kjvLists.name;
      } else {
        const books = kjvBin[binIdx.kjvBinIdx.books];
        const bookBin = this.findBin(books, bookIdx);
        if (chapterIdx === -1) {
          this.filteredVerses = kjvBin[binIdx.kjvBinIdx.verses]
            .slice(bookBin[binIdx.bookBinIdx.sliceStart], bookBin[binIdx.bookBinIdx.sliceEnd]);
          this.wordCount = bookBin[binIdx.bookBinIdx.wordCount];
          this.verseCount = bookBin[binIdx.bookBinIdx.verseCount];
          this.citation = kjvLists.books[bookIdx][kjvIdx.book.longName];
        } else {
          const chapters = bookBin[binIdx.bookBinIdx.chapters];
          const chapterBin = this.findBin(chapters, chapterIdx);
          this.filteredVerses = kjvBin[binIdx.kjvBinIdx.verses]
            .slice(chapterBin[binIdx.chapterBinIdx.sliceStart],
              chapterBin[binIdx.chapterBinIdx.sliceEnd]);
          this.wordCount = chapterBin[binIdx.chapterBinIdx.wordCount];
          this.verseCount = chapterBin[binIdx.chapterBinIdx.verseCount];
          this.citation = kjvLists.chapters[chapterIdx][kjvIdx.chapter.name];
        }
      }
    } else {
      this.filteredVerses = [];
      this.wordCount = null;
      this.verseCount = null;
      this.citation = null;
    }
  }

  buildPage() {
    this.page = template.page('strong-result');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('strong-result');

    this.empty = template.element('div', 'empty', 'strong-result', null, 'No Strong Result.');
    this.scroll.appendChild(this.empty);

    this.list = template.element('div', 'list', 'strong-result', null, null);
    this.scroll.appendChild(this.list);

    this.loadMore = template.element('div', 'load-more', 'strong-result', null, null);
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

  buildStrongText(verseObj) {
    const verseIdx = verseObj.k;
    const verse = verseObj.v;
    const parts = [];
    const kjvWords = verse[kjvIdx.verse.text].split(' ');
    const maps = this.strongWordMapObjs.find(x => x.k === verseIdx).v;
    for (const map of maps) {
      const strongStr = map[strongIdx.map.strongNums].join(' ');
      const cleanNums = map[strongIdx.map.strongNums].map(x => x.replace(/[()@]/g, ''));
      const phrase = map[strongIdx.map.verseFragment];
      parts.push(phrase);
      if (cleanNums.includes(this.strongDef)) {
        parts.push(`<span class="super"> ${strongStr}</span>`);
      }
    }
    const innerHtml = parts.join(' ').replace(/ <span/g, '<span');
    return innerHtml;
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

  defUpdate(strongDefObj) {
    this.strongDefObj = strongDefObj;
    this.strongDef = this.strongDefObj.k;
    this.updateBanner();
    this.updateResult();
  }

  filterChange() {
    this.filterChangePending = true;
  }

  filterUpdate(strongFilter) {
    this.strongFilter = strongFilter;
    this.applyFilter();
    if (this.filterChangePending) {
      this.filterChangePending = false;
      this.updatePane();
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
    this.btnBanner = this.toolbarUpper.querySelector('.btn-banner--strong-result');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
    this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
    this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
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
    this.lastFont = null;
    this.lastFontSize = null;
    this.lastFontVariant = null;
    this.strongMode = false;
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
        if (btn.classList.contains('btn-result')) {
          const verseIdx = parseInt(btn.dataset.verseIdx);
          if (this.strongMode) {
            queue.publish('strong-result.strong-select', verseIdx);
          } else {
            queue.publish('strong-result.read-select', verseIdx);
          }
        }
      }
    }
  }

  loadMoreClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-load-more');
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
      const sliceEnd = Math.min(this.loadIdx + loadIncrement, this.verseCount);
      verses = this.filteredVerses.slice(this.loadIdx, sliceEnd);
      this.loadIdx = sliceEnd;
    }

    const fragment = document.createDocumentFragment();
    const verseObjs = this.strongWordVerseObjs.filter(x => verses.includes(x.k));
    for (const verseObj of verseObjs) {
      const verse = this.addVerse(verseObj);
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

    queue.subscribe('strong-result.hide', () => {
      this.hide();
    });
    queue.subscribe('strong-result.show', () => {
      this.show();
    });

    queue.subscribe('strong.def.update', (strongDefObj) => {
      this.defUpdate(strongDefObj);
    });
    queue.subscribe('strong.filter.change', () => {
      this.filterChange();
    });
    queue.subscribe('strong.filter.update', (strongFilter) => {
      this.filterUpdate(strongFilter);
    });
    queue.subscribe('strong.strong-mode.update', (strongMode) => {
      this.modeUpdate(strongMode);
    });
    queue.subscribe('strong.word.change', () => {
      this.wordChange();
    });
    queue.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
    });
    queue.subscribe('strong.wordKjvBin.update', (wordKjvBin) => {
      this.wordKjvBinUpdate(wordKjvBin);
    });
    queue.subscribe('strong.wordMap.update', (wordMapObjs) => {
      this.wordMapUpdate(wordMapObjs);
    });
    queue.subscribe('strong.wordVerse.update', (wordVerseObjs) => {
      this.wordVerseUpdate(wordVerseObjs);
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
        queue.publish('strong.back', null);
      } else if (btn === this.btnLookup) {
        queue.publish('strong-lookup', null);
      } else if (btn === this.btnDef) {
        queue.publish('strong-def', null);
      } else if (btn === this.btnFilter) {
        queue.publish('strong-filter', null);
      } else if (btn === this.btnHistory) {
        queue.publish('strong-history', null);
      } else if (btn === this.btnVerse) {
        queue.publish('strong-verse', null);
      } else if (btn === this.btnStrongMode) {
        queue.publish('strong.strong-mode.click', null);
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
    if (this.citation) {
      this.btnBanner.innerHTML = `${this.citation} ` +
        `(${this.wordCount}/${this.verseCount})<br>` +
        `${this.strongDef} ${this.strongWord}`;
    } else {
      this.btnBanner.innerHTML = this.strongDef;
    }
  }

  updatePane() {
    this.updateBanner();
    this.updateResult();
  }

  updateResult() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    if (this.verseCount) {
      this.empty.classList.add('hide');
    } else {
      this.empty.classList.remove('hide');
    }
    this.loadIdx = 0;
    this.loadedVerses = 0;
    this.loadVerses();
  }

  wordChange() {
    this.wordChangePending = true;
  }

  wordMapUpdate(wordMapObjs) {
    this.strongWordMapObjs = wordMapObjs;
  }

  wordKjvBinUpdate(wordKjvBin) {
    this.strongwordKjvBin = wordKjvBin;
  }

  wordVerseUpdate(wordVerseObjs) {
    this.strongWordVerseObjs = wordVerseObjs;
  }

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
    if (this.wordChangePending) {
      this.wordChangePending = false;
      this.updatePane();
    }
  }

}

export { StrongResultView };
