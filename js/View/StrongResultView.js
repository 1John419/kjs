'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import { strong } from '../Tome/strong.js';

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
  { type: 'btn', icon: 'filter', label: 'Strong Filter' },
  { type: 'btn', icon: 'strong-mode', label: 'Strong Mode' },
  { type: 'btn', icon: 'strong-verse', label: 'Strong Verse' },
  { type: 'btn', icon: 'strong-def', label: 'Strong Definition' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-result', text: 'Strong Search' }
];

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

  addVerse(verseIdx) {
    let btn = document.createElement('button');
    btn.classList.add('btn-result');
    btn.dataset.verseIdx = verseIdx;
    let resultText = document.createElement('span');
    resultText.classList.add('span-search-text');
    let acrostic = this.buildAcrosticSpan(verseIdx);
    let ref = this.buildRefSpan(verseIdx);
    resultText.appendChild(ref);
    if (acrostic) {
      resultText.appendChild(acrostic);
    }
    let text = this.buildStrongText(verseIdx);
    resultText.insertAdjacentHTML('beforeend', text);
    btn.appendChild(resultText);
    return btn;
  }

  applyFilter() {
    let tomeBin = strong.words[this.strongDef][this.strongWord];
    let bookIdx = this.strongFilter.bookIdx;
    let chapterIdx = this.strongFilter.chapterIdx;
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

  buildRefSpan(verseIdx) {
    let refSpan = document.createElement('span');
    refSpan.classList.add('verse-ref');
    refSpan.textContent = getRefName(verseIdx);
    return refSpan;
  }

  buildStrongText(verseIdx) {
    let parts = [];
    let kjvWords = tome.verses[verseIdx].split(' ');
    let fragments = strong.fragments[verseIdx];
    for (let fragment of fragments) {
      let sliceStart = fragment[0];
      let sliceEnd = fragment[1];
      let strongNums = fragment[2];
      let strongStr = strongNums.join(' ');
      let cleanNums = strongNums.map(x => x.replace(/[()]/g, ''));
      let phrase = kjvWords.slice(sliceStart, sliceEnd).join(' ');
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

  defUpdate(strongDef) {
    this.strongDef = strongDef;
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

  scrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
    } else {
      this.scroll.scrollTop = 0;
    }
  }

  show() {
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
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

    bus.subscribe('strong.def.update', (strongDef) => {
      this.defUpdate(strongDef);
    });
    bus.subscribe('strong.filter.update', (strongFilter) => {
      this.filterUpdate(strongFilter);
    });
    bus.subscribe('strong.strong.mode.update', (strongMode) => {
      this.modeUpdate(strongMode);
    });
    bus.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
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
        bus.publish('strong.strong.mode.click', null);
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

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
  }

}

export { StrongResultView };
