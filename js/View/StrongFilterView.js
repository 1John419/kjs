'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { binIdx } from '../data/binIdx.js';
import { kjvIdx } from '../data/kjvIdx.js';
import { kjvLists } from '../data/kjvLists.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
  { type: 'btn', icon: 'strong-def', ariaLabel: null },
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
  { type: 'btn', icon: 'strong-verse', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'strong-filter', text: 'Strong Filter' },
];

class StrongFilterView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildBookFilter(bookBin) {
    const bookIdx = bookBin[binIdx.bookBinIdx.bookIdx];
    const wordCount = bookBin[binIdx.bookBinIdx.wordCount];
    const verseCount = bookBin[binIdx.bookBinIdx.verseCount];
    const citation = kjvLists.books[bookIdx][kjvIdx.book.longName];

    const bookFilter = document.createElement('div');
    bookFilter.classList.add('filter', 'filter--book');

    const btnUnfold = template.btnIcon('next', 'filter-next', null);
    btnUnfold.dataset.bookIdx = bookIdx;
    bookFilter.appendChild(btnUnfold);

    const btnFold = template.btnIcon('down', 'filter-down', null);
    btnFold.classList.add('hide');
    btnFold.dataset.bookIdx = bookIdx;
    bookFilter.appendChild(btnFold);

    const btnFilter = document.createElement('div');
    btnFilter.classList.add('btn-filter', 'btn-filter--book');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = bookIdx;
    btnFilter.dataset.chapterIdx = -1;
    bookFilter.appendChild(btnFilter);

    return bookFilter;
  }

  buildChapterFilter(bookBin, chapterBin) {
    const bookIdx = bookBin[binIdx.bookBinIdx.bookIdx];
    const chapterIdx = chapterBin[binIdx.chapterBinIdx.chapterIdx];
    const wordCount = chapterBin[binIdx.chapterBinIdx.wordCount];
    const verseCount = chapterBin[binIdx.chapterBinIdx.verseCount];
    const citation = kjvLists.chapters[chapterIdx][kjvIdx.chapter.name];

    const btnFilter = document.createElement('div');
    btnFilter.classList.add('btn-filter', 'btn-filter--chapter',
      'hide');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = bookIdx;
    btnFilter.dataset.chapterIdx = chapterIdx;

    return btnFilter;
  }

  buildFilters() {
    const fragment = document.createDocumentFragment();
    const kjvFilter = this.buildKjvFilter();
    fragment.appendChild(kjvFilter);
    const books = this.strongWordKjvBin[binIdx.kjvBinIdx.books];
    for (const bookBin of books) {
      const bookFilter = this.buildBookFilter(bookBin);
      fragment.appendChild(bookFilter);
      const chapters = bookBin[binIdx.bookBinIdx.chapters];
      for (const chapterBin of chapters) {
        const chapterFilter = this.buildChapterFilter(bookBin, chapterBin);
        fragment.appendChild(chapterFilter);
      }
    }
    return fragment;
  }

  buildPage() {
    this.page = template.page('strong-filter');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('strong-filter');

    this.empty = template.element('div', 'empty', 'strong-filter', null, 'No Strong Filter.');
    this.scroll.appendChild(this.empty);
    this.list = template.element('div', 'list', 'strong-filter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildKjvFilter() {
    const citation = kjvLists.name;
    const wordCount = this.strongWordKjvBin[binIdx.kjvBinIdx.wordCount];
    const verseCount = this.strongWordKjvBin[binIdx.kjvBinIdx.verseCount];

    const btnFilter = document.createElement('div');
    btnFilter.classList.add('btn-filter', 'btn-filter--kjv');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = -1;
    btnFilter.dataset.chapterIdx = -1;

    return btnFilter;
  }

  defUpdate(strongDefObj) {
    this.strongDefObj = strongDefObj;
    this.strongDef = this.strongDefObj.k;
    this.updatePane();
  }

  filterClick(btnFilter) {
    const bookIdx = parseInt(btnFilter.dataset.bookIdx);
    const chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
    const strongFilter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx,
    };
    queue.publish('strong-filter.select', strongFilter);
  }

  filterUpdate(strongFilter) {
    this.strongFilter = strongFilter;
    this.updateActiveFilter();
  }

  foldClick(btnFold) {
    const bookIdxStr = btnFold.dataset.bookIdx;
    const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`);
    for (const chapter of chapters) {
      chapter.classList.add('hide');
    }
    btnFold.classList.add('hide');
    const btnUnfold = btnFold.previousSibling;
    btnUnfold.classList.remove('hide');
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--strong-filter');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
    this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
    this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.btnActiveFilter = null;
  }

  listClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      if (btn.classList.contains('btn-filter')) {
        this.filterClick(btn);
      } else if (btn.classList.contains('btn-icon--filter-down')) {
        this.foldClick(btn);
      } else if (btn.classList.contains('btn-icon--filter-next')) {
        this.unfoldClick(btn);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('strong-filter.hide', () => {
      this.hide();
    });
    queue.subscribe('strong-filter.show', () => {
      this.show();
    });

    queue.subscribe('strong.def.update', (strongDefObj) => {
      this.defUpdate(strongDefObj);
    });
    queue.subscribe('strong.filter.update', (strongFilter) => {
      this.filterUpdate(strongFilter);
    });
    queue.subscribe('strong.word.change', () => {
      this.wordChange();
    });
    queue.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
    });
    queue.subscribe('strong.wordKjvBin.update', (strongWordKjvBin) => {
      this.wordKjvBinUpdate(strongWordKjvBin);
    });
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
      } else if (btn === this.btnResult) {
        queue.publish('strong-result', null);
      } else if (btn === this.btnHistory) {
        queue.publish('strong-history', null);
      } else if (btn === this.btnVerse) {
        queue.publish('strong-verse', null);
      }
    }
  }

  unfoldClick(btnUnfold) {
    const bookIdxStr = btnUnfold.dataset.bookIdx;
    const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`);
    for (const chapter of chapters) {
      chapter.classList.remove('hide');
    }
    btnUnfold.classList.add('hide');
    const btnFold = btnUnfold.nextSibling;
    btnFold.classList.remove('hide');
  }

  updateActiveFilter() {
    if (this.strongWordKjvBin.length) {
      if (this.btnActiveFilter) {
        this.btnActiveFilter.classList.remove('btn-filter--active');
      }
      const bookIdx = this.strongFilter.bookIdx;
      const chapterIdx = this.strongFilter.chapterIdx;
      const query = `.btn-filter[data-book-idx="${bookIdx}"]` +
        `[data-chapter-idx="${chapterIdx}"]`;
      const btn = this.list.querySelector(query);
      if (btn) {
        this.btnActiveFilter = btn;
        btn.classList.add('btn-filter--active');
      }
    }
  }

  updateBanner() {
    if (this.strongWord) {
      this.banner.innerHTML = `${this.strongDef} ${this.strongWord}`;
    } else {
      this.banner.innerHTML = `${this.strongDef}`;
    }
  }

  updateFilters() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    if (this.strongWordKjvBin.length) {
      this.empty.classList.add('hide');
      const list = this.buildFilters();
      this.list.appendChild(list);
    } else {
      this.empty.classList.remove('hide');
    }
  }

  updatePane() {
    this.updateBanner();
    this.updateFilters();
    this.updateActiveFilter();
  }

  wordChange() {
    this.wordChangePending = true;
  }

  wordKjvBinUpdate(strongWordKjvBin) {
    this.strongWordKjvBin = strongWordKjvBin;
  }

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
    if (this.wordChangePending && this.strongWord) {
      this.wordChangePending = false;
      this.updatePane();
    }
  }

}

export { StrongFilterView };
