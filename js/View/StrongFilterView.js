'use strict';

import {
  queue,
} from '../CommandQueue.js';
import {
  templateBtnIcon,
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
  bookBinBookIdx,
  bookBinChapters,
  bookBinVerseCount,
  bookBinWordCount,
  chapterBinChapterIdx,
  chapterBinVerseCount,
  chapterBinWordCount,
  tomeBinBooks,
  tomeBinVerseCount,
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
} from '../data/tomeIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'result', ariaLabel: 'Strong Result' },
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
    let bookIdx = bookBin[bookBinBookIdx];
    let wordCount = bookBin[bookBinWordCount];
    let verseCount = bookBin[bookBinVerseCount];
    let citation = tomeBooks[bookIdx][bookLongName];

    let bookFilter = document.createElement('div');
    bookFilter.classList.add('filter', 'filter--book');

    let btnUnfold = templateBtnIcon('next', 'filter-next', 'Unfold Book');
    btnUnfold.dataset.bookIdx = bookIdx;
    bookFilter.appendChild(btnUnfold);

    let btnFold = templateBtnIcon('down', 'filter-down', 'Fold Book');
    btnFold.classList.add('btn-icon--hide');
    btnFold.dataset.bookIdx = bookIdx;
    bookFilter.appendChild(btnFold);

    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--book');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = bookIdx;
    btnFilter.dataset.chapterIdx = -1;
    bookFilter.appendChild(btnFilter);

    return bookFilter;
  }

  buildChapterFilter(bookBin, chapterBin) {
    let bookIdx = bookBin[bookBinBookIdx];
    let chapterIdx = chapterBin[chapterBinChapterIdx];
    let wordCount = chapterBin[chapterBinWordCount];
    let verseCount = chapterBin[chapterBinVerseCount];
    let citation = tomeChapters[chapterIdx][chapterName];

    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--chapter',
      'btn-filter--hide');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = bookIdx;
    btnFilter.dataset.chapterIdx = chapterIdx;

    return btnFilter;
  }

  buildFilters() {
    let fragment = document.createDocumentFragment();
    let tomeFilter = this.buildTomeFilter();
    fragment.appendChild(tomeFilter);
    let books = this.strongWordTomeBin[tomeBinBooks];
    for (let bookBin of books) {
      let bookFilter = this.buildBookFilter(bookBin);
      fragment.appendChild(bookFilter);
      let chapters = bookBin[bookBinChapters];
      for (let chapterBin of chapters) {
        let chapterFilter = this.buildChapterFilter(bookBin, chapterBin);
        fragment.appendChild(chapterFilter);
      }
    }
    return fragment;
  }

  buildPage() {
    this.page = templatePage('strong-filter');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('strong-filter');

    this.empty = templateElement('div', 'empty', 'strong-filter', null,
      'No Strong Filter.');
    this.scroll.appendChild(this.empty);
    this.list = templateElement('div', 'list', 'strong-filter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildTomeFilter() {
    let citation = tomeName;
    let wordCount = this.strongWordTomeBin[tomeBinWordCount];
    let verseCount = this.strongWordTomeBin[tomeBinVerseCount];

    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--tome');
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
    let bookIdx = parseInt(btnFilter.dataset.bookIdx);
    let chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
    let strongFilter = {
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
    let bookIdxStr = btnFold.dataset.bookIdx;
    let chapters = this.list.querySelectorAll(
      `.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
    );
    for (let chapter of chapters) {
      chapter.classList.add('btn-filter--hide');
    }
    btnFold.classList.add('btn-icon--hide');
    let btnUnfold = btnFold.previousSibling;
    btnUnfold.classList.remove('btn-icon--hide');
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--strong-filter');

    this.btnResult = this.toolbarLower.querySelector(
      '.btn-icon--result');
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
    let btn = event.target.closest('button');
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

  scrollToTop() {
    this.scroll.scrollTop = 0;
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
    queue.subscribe('strong.wordTomeBin.update', (strongWordTomeBin) => {
      this.wordTomeBinUpdate(strongWordTomeBin);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnResult) {
        queue.publish('strong-result', null);
      }
    }
  }

  unfoldClick(btnUnfold) {
    let bookIdxStr = btnUnfold.dataset.bookIdx;
    let chapters = this.list.querySelectorAll(
      `.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
    );
    for (let chapter of chapters) {
      chapter.classList.remove('btn-filter--hide');
    }
    btnUnfold.classList.add('btn-icon--hide');
    let btnFold = btnUnfold.nextSibling;
    btnFold.classList.remove('btn-icon--hide');
  }

  updateActiveFilter() {
    if (this.strongWordTomeBin.length) {
      if (this.btnActiveFilter) {
        this.btnActiveFilter.classList.remove('btn-filter--active');
      }
      let bookIdx = this.strongFilter.bookIdx;
      let chapterIdx = this.strongFilter.chapterIdx;
      let query = `.btn-filter[data-book-idx="${bookIdx}"]` +
        `[data-chapter-idx="${chapterIdx}"]`;
      let btn = this.list.querySelector(query);
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
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.strongWordTomeBin.length) {
      this.empty.classList.add('empty--hide');
      let list = this.buildFilters();
      this.list.appendChild(list);
    } else {
      this.empty.classList.remove('empty--hide');
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

  wordTomeBinUpdate(strongWordTomeBin) {
    this.strongWordTomeBin = strongWordTomeBin;
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
