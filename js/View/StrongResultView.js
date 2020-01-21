'use strict';

import { bus } from '../EventBus.js';
import {
  tomeBinBooks,
  bookBinChapters,
  bookBinSliceEnd,
  bookBinSliceStart,
  bookBinVerseCount,
  bookBinWordCount,
  chapterBinSliceEnd,
  chapterBinSliceStart,
  chapterBinVerseCount,
  chapterBinWordCount,
  tomeBinVerses,
  tomeBinVerseCount,
  tomeBinWordCount
} from '../data/binIdx.js';
import {
  mapSliceEnd,
  mapSliceStart,
  mapStrongNums
} from '../data/strongIdx.js';
import {
  tomeAcrostics,
  tomeBooks,
  tomeChapters,
  tomeName
} from '../data/tomeDb.js';
import {
  bookLongName,
  chapterName,
  verseCitation,
  verseText
} from '../data/tomeIdx.js';
import {
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import {
  removeAllChildren
} from '../util.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'filter', label: 'Strong Filter' },
  { type: 'btn', icon: 'strong-verse', label: 'Strong Verse' },
  { type: 'btn', icon: 'strong-def', label: 'Strong Definition' },
  { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-result', text: 'Strong Search' }
];

const binIdx = 0;
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
  }

  addVerse(verseObj) {
    let btn = document.createElement('button');
    btn.classList.add('btn-result');
    btn.dataset.verseIdx = verseObj.k;
    let resultText = document.createElement('span');
    resultText.classList.add('span-search-text');
    let acrostic = this.buildAcrosticSpan(verseObj);
    let ref = this.buildRefSpan(verseObj);
    resultText.appendChild(ref);
    if (acrostic) {
      resultText.appendChild(acrostic);
    }
    let text = this.buildStrongText(verseObj);
    resultText.insertAdjacentHTML('beforeend', text);
    btn.appendChild(resultText);
    return btn;
  }

  applyFilter() {
    let tomeBin = this.strongWordTomeBin;
    let bookIdx = this.strongFilter.bookIdx;
    let chapterIdx = this.strongFilter.chapterIdx;
    if (bookIdx === -1 && chapterIdx === -1) {
      this.filteredVerses = tomeBin[tomeBinVerses];
      this.wordCount = tomeBin[tomeBinWordCount];
      this.verseCount = tomeBin[tomeBinVerseCount];
      this.citation = tomeName;
    } else {
      let books = tomeBin[tomeBinBooks];
      let bookBin = this.findBin(books, bookIdx);
      if (chapterIdx === -1) {
        this.filteredVerses = tomeBin[tomeBinVerses]
          .slice(bookBin[bookBinSliceStart], bookBin[bookBinSliceEnd]);
        this.wordCount = bookBin[bookBinWordCount];
        this.verseCount = bookBin[bookBinVerseCount];
        this.citation = tomeBooks[bookIdx][bookLongName];
      } else {
        let chapters = bookBin[bookBinChapters];
        let chapterBin = this.findBin(chapters, chapterIdx);
        this.filteredVerses = tomeBin[tomeBinVerses]
          .slice(chapterBin[chapterBinSliceStart],
            chapterBin[chapterBinSliceEnd]);
        this.wordCount = chapterBin[chapterBinWordCount];
        this.verseCount = chapterBin[chapterBinVerseCount];
        this.citation = tomeChapters[chapterIdx][chapterName];
      }
    }
  }

  buildAcrosticSpan(verseObj) {
    let acrosticSpan = undefined;
    if (tomeAcrostics) {
      let acrostic = tomeAcrostics[verseObj.k];
      if (acrostic) {
        acrosticSpan = document.createElement('span');
        acrosticSpan.classList.add('verse-acrostic');
        acrosticSpan.textContent = acrostic;
      }
    }
    return acrosticSpan;
  }

  buildPage() {
    this.page = templatePage('strong-result');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('strong-result');

    this.list = templateElement('div', 'list', 'strong-result', null, null);
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

  buildRefSpan(verseObj) {
    let refSpan = document.createElement('span');
    refSpan.classList.add('verse-ref');
    refSpan.textContent = verseObj.v[verseCitation];
    return refSpan;
  }

  buildStrongText(verseObj) {
    let verseIdx = verseObj.k;
    let verse = verseObj.v;
    let parts = [];
    let kjvWords = verse[verseText].split(' ');
    let maps = this.strongWordMapObjs.find(x => x.k === verseIdx).v;
    for (let map of maps) {
      let strongStr = map[mapStrongNums].join(' ');
      let cleanNums = map[mapStrongNums].map(x => x.replace(/[()]/g, ''));
      let phrase = kjvWords.slice(map[mapSliceStart], map[mapSliceEnd]).join(' ');
      parts.push(phrase);
      if (cleanNums.includes(this.strongDef)) {
        parts.push(`<span class="super">${strongStr}</span>`);
      }
    }
    let innerHtml = parts.join(' ').replace(/ <span/g, '<span');
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

  defUpdate(strongDefObj) {
    this.strongDefObj = strongDefObj;
    this.strongDef = this.strongDefObj.k;
  }

  filterUpdate(strongFilter) {
    this.strongFilter = strongFilter;
    if (this.strongWord) {
      this.applyFilter();
      this.updateBanner();
      this.updateList();
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
    this.banner = this.toolbarUpper.querySelector('.banner--strong-result');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnStrongMode = this.toolbarLower.querySelector(
      '.btn-icon--strong-mode');
    this.btnStrongDef = this.toolbarLower.querySelector(
      '.btn-icon--strong-def');
    this.btnStrongVerse = this.toolbarLower.querySelector(
      '.btn-icon--strong-verse');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.strongMode = false;
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target;
    let btn = target.closest('button');
    if (btn) {
      if (btn.classList.contains('btn-result')) {
        let verseIdx = parseInt(btn.dataset.verseIdx);
        if (this.strongMode) {
          bus.publish('strong-result.strong-select', verseIdx);
        } else {
          bus.publish('strong-result.read-select', verseIdx);
        }
      }
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
    let verseObjs = this.strongWordVerseObjs.filter(x => verses.includes(x.k));
    for (let verseObj of verseObjs) {
      let verse = this.addVerse(verseObj);
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

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
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

    bus.subscribe('strong-result.hide', () => {
      this.hide();
    });
    bus.subscribe('strong-result.show', () => {
      this.show();
    });

    bus.subscribe('strong.def.update', (strongDefObj) => {
      this.defUpdate(strongDefObj);
    });
    bus.subscribe('strong.filter.update', (strongFilter) => {
      this.filterUpdate(strongFilter);
    });
    bus.subscribe('strong.strong-mode.update', (strongMode) => {
      this.modeUpdate(strongMode);
    });
    bus.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
    });
    bus.subscribe('strong.wordTomeBin.update', (wordTomeBin) => {
      this.wordTomeBinUpdate(wordTomeBin);
    });
    bus.subscribe('strong.wordMap.update', (wordMapObjs) => {
      this.wordMapUpdate(wordMapObjs);
    });
    bus.subscribe('strong.wordVerse.update', (wordVerseObjs) => {
      this.wordVerseUpdate(wordVerseObjs);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        bus.publish('strong.back', null);
      } else if (target === this.btnFilter) {
        bus.publish('strong-filter', null);
      } else if (target === this.btnStrongMode) {
        bus.publish('strong.strong-mode.click', null);
      } else if (target === this.btnStrongDef) {
        bus.publish('strong-def', null);
      } else if (target === this.btnStrongVerse) {
        bus.publish('strong-verse', null);
      }
    }
  }

  updateBanner() {
    this.banner.innerHTML = `${this.citation} ` +
      `(${this.wordCount}/${this.verseCount})<br>` +
      `${this.strongDef} ${this.strongWord}`;
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    this.loadIdx = 0;
    this.loadedVerses = 0;
    this.loadVerses();
  }

  wordMapUpdate(wordMapObjs) {
    this.strongWordMapObjs = wordMapObjs;
  }

  wordTomeBinUpdate(wordTomeBin) {
    this.strongWordTomeBin = wordTomeBin;
  }

  wordVerseUpdate(wordVerseObjs) {
    this.strongWordVerseObjs = wordVerseObjs;
  }

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
  }

}

export { StrongResultView };
