'use strict';

import { queue } from '../CommandQueue.js';
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
  tomeBinWordCount
} from '../data/binIdx.js';
import {
  tomeChapters,
  tomeName,
  tomeBooks
} from '../data/tomeDb.js';
import {
  bookLongName,
  chapterName
} from '../data/tomeIdx.js';
import {
  templateBtnIcon,
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
  { type: 'btn', icon: 'result', label: 'Search Result' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'search-filter', text: null }
];

class SearchFilterView {

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

    let btnUnfold = templateBtnIcon('next', 'Unfold Book');
    btnUnfold.dataset.bookIdx = bookIdx;
    bookFilter.appendChild(btnUnfold);

    let btnFold = templateBtnIcon('down', 'Fold Book');
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
    let tomeBin = this.rig.tomeBin;
    let tomeFilter = this.buildTomeFilter(tomeBin);
    fragment.appendChild(tomeFilter);
    let books = tomeBin[tomeBinBooks];
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
    this.page = templatePage('search-filter');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('search-filter');
    this.list = templateElement('div', 'list', 'search-filter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildTomeFilter(tomeBin) {
    let citation = tomeName;
    let wordCount = tomeBin[tomeBinWordCount];
    let verseCount = tomeBin[tomeBinVerseCount];

    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--tome');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = -1;
    btnFilter.dataset.chapterIdx = -1;

    return btnFilter;
  }

  filterClick(btnFilter) {
    let bookIdx = parseInt(btnFilter.dataset.bookIdx);
    let chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
    let searchFilter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx
    };
    queue.publish('search-filter.select', searchFilter);
  }

  filterUpdate(searchFilter) {
    this.searchFilter = searchFilter;
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
    this.banner = this.toolbarUpper.querySelector('.banner--search-filter');

    this.btnSearchResult = this.toolbarLower.querySelector(
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
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target.classList.contains('btn-filter')) {
        this.filterClick(target);
      } else if (target.classList.contains('btn-icon--down')) {
        this.foldClick(target);
      } else if (target.classList.contains('btn-icon--next')) {
        this.unfoldClick(target);
      }
    }
  }

  rigUpdate(rig) {
    this.rig = rig;
    this.updateBanner();
    this.updateFilters();
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('rig.update', (rig) => {
      this.rigUpdate(rig);
    });

    queue.subscribe('search-filter.hide', () => {
      this.hide();
    });
    queue.subscribe('search-filter.show', () => {
      this.show();
    });

    queue.subscribe('search.filter.update', (filter) => {
      this.filterUpdate(filter);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnSearchResult) {
        queue.publish('search-result', null);
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
    if (this.btnActiveFilter) {
      this.btnActiveFilter.classList.remove('btn-filter--active');
    }
    let bookIdx = this.searchFilter.bookIdx;
    let chapterIdx = this.searchFilter.chapterIdx;
    let query = `.btn-filter[data-book-idx="${bookIdx}"]` +
      `[data-chapter-idx="${chapterIdx}"]`;
    let btn = this.list.querySelector(query);
    if (btn) {
      this.btnActiveFilter = btn;
      btn.classList.add('btn-filter--active');
    }
  }

  updateBanner() {
    this.banner.innerHTML = `${this.rig.query}`;
  }

  updateFilters() {
    this.scrollToTop();
    removeAllChildren(this.list);
    if (this.rig.state === 'OK') {
      let list = this.buildFilters();
      this.list.appendChild(list);
    }
  }

}

export { SearchFilterView };
