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
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'search-filter', text: null },
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
    const kjvBin = this.rig.kjvBin;
    const kjvFilter = this.buildKjvFilter(kjvBin);
    fragment.appendChild(kjvFilter);
    const books = kjvBin[binIdx.kjvBinIdx.books];
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
    this.page = template.page('search-filter');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('search-filter');
    this.list = template.element('div', 'list', 'search-filter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildKjvFilter(kjvBin) {
    const citation = kjvLists.name;
    const wordCount = kjvBin[binIdx.kjvBinIdx.wordCount];
    const verseCount = kjvBin[binIdx.kjvBinIdx.verseCount];

    const btnFilter = document.createElement('div');
    btnFilter.classList.add('btn-filter', 'btn-filter--kjv');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = -1;
    btnFilter.dataset.chapterIdx = -1;

    return btnFilter;
  }

  clearFilter() {
    this.banner.innerHTML = 'Query Error';
    util.removeAllChildren(this.list);
  }

  filterClick(btnFilter) {
    const bookIdx = parseInt(btnFilter.dataset.bookIdx);
    const chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
    const searchFilter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx,
    };
    queue.publish('search-filter.select', searchFilter);
  }

  filterUpdate(searchFilter) {
    this.searchFilter = searchFilter;
    this.updateActiveFilter();
  }

  foldClick(btnFold) {
    const bookIdxStr = btnFold.dataset.bookIdx;
    const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
    );
    for (const chapter of chapters) {
      chapter.classList.add('hide');
    }
    btnFold.classList.add('hide');
    const btnUnfold = btnFold.previousSibling;
    btnUnfold.classList.remove('hide');
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--search-filter');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--search-lookup');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
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

  rigUpdate(rig) {
    this.rig = rig;
    this.updateBanner();
    this.updateFilters();
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
    queue.subscribe('search.query.error', () => {
      this.clearFilter();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('search.back', null);
      } else if (btn === this.btnLookup) {
        queue.publish('search-lookup', null);
      } else if (btn === this.btnResult) {
        queue.publish('search-result', null);
      } else if (btn === this.btnHistory) {
        queue.publish('search-history', null);
      }
    }
  }

  unfoldClick(btnUnfold) {
    const bookIdxStr = btnUnfold.dataset.bookIdx;
    const chapters = this.list.querySelectorAll(`.btn-filter--chapter[data-book-idx="${bookIdxStr}"]`
    );
    for (const chapter of chapters) {
      chapter.classList.remove('hide');
    }
    btnUnfold.classList.add('hide');
    const btnFold = btnUnfold.nextSibling;
    btnFold.classList.remove('hide');
  }

  updateActiveFilter() {
    if (this.btnActiveFilter) {
      this.btnActiveFilter.classList.remove('btn-filter--active');
    }
    const bookIdx = this.searchFilter.bookIdx;
    const chapterIdx = this.searchFilter.chapterIdx;
    const query = `.btn-filter[data-book-idx="${bookIdx}"]` +
      `[data-chapter-idx="${chapterIdx}"]`;
    const btn = this.list.querySelector(query);
    if (btn) {
      this.btnActiveFilter = btn;
      btn.classList.add('btn-filter--active');
    }
  }

  updateBanner() {
    this.banner.innerHTML = `${this.rig.query}`;
  }

  updateFilters() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    if (this.rig.state === 'OK') {
      const list = this.buildFilters();
      this.list.appendChild(list);
    }
  }

}

export { SearchFilterView };
