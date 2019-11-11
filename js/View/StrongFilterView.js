'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import { strong } from '../Tome/strong.js';

import {
  getBookName,
  getChapterName,
  removeAllChildren
} from '../util.js';

import {
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'result', label: 'Strong Result' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-filter', text: 'Strong Filter' }
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
    let bookIdx = bookBin[0];
    let wordCount = bookBin[1];
    let verseCount = bookBin[2];
    let citation = getBookName(bookIdx);

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
    let bookIdx = bookBin[0];
    let chapterIdx = chapterBin[0];
    let wordCount = chapterBin[1];
    let verseCount = chapterBin[2];
    let citation = getChapterName(chapterIdx);

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
    let tomeBin = strong.words[this.strongDef][this.strongWord];
    let tomeFilter = this.buildTomeFilter(tomeBin);
    fragment.appendChild(tomeFilter);
    let books = tomeBin[2];
    for (let bookBin of books) {
      let bookFilter = this.buildBookFilter(bookBin);
      fragment.appendChild(bookFilter);
      let chapters = bookBin[5];
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
    this.list = templateElement('div', 'list', 'strong-filter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildTomeFilter(tomeBin) {
    let citation = tome.name;
    let wordCount = tomeBin[0];
    let verseCount = tomeBin[1];

    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--tome');
    btnFilter.textContent = `${citation} (${wordCount}/${verseCount})`;
    btnFilter.dataset.bookIdx = -1;
    btnFilter.dataset.chapterIdx = -1;

    return btnFilter;
  }

  defUpdate(strongDef) {
    this.strongDef = strongDef;
  }

  filterClick(btnFilter) {
    let bookIdx = parseInt(btnFilter.dataset.bookIdx);
    let chapterIdx = parseInt(btnFilter.dataset.chapterIdx);
    let strongFilter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx
    };
    bus.publish('strong-filter.select', strongFilter);
  }

  filterUpdate(strongFilter) {
    this.strongFilter = strongFilter;
    this.updateActiveFilter();
  }

  foldClick(btnFold) {
    let bookIdx = btnFold.dataset.bookIdx;
    let chapters = this.list.querySelectorAll(
      `.btn-filter--chapter[data-book-idx="${bookIdx}"]`
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
    bus.subscribe('strong-filter.hide', () => {
      this.hide();
    });
    bus.subscribe('strong-filter.show', () => {
      this.show();
    });

    bus.subscribe('strong.def.update', (strongDef) => {
      this.defUpdate(strongDef);
    });
    bus.subscribe('strong.filter.update', (strongFilter) => {
      this.filterUpdate(strongFilter);
    });
    bus.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnResult) {
        bus.publish('strong-result', null);
      }
    }
  }

  unfoldClick(btnUnfold) {
    let bookIdx = btnUnfold.dataset.bookIdx;
    let chapters = this.list.querySelectorAll(
      `.btn-filter--chapter[data-book-idx="${bookIdx}"]`
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

  updateBanner() {
    this.banner.innerHTML = `${this.strongDef} ${this.strongWord}`;
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    let list = this.buildFilters();
    this.list.appendChild(list);
  }

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
    if (this.strongWord) {
      this.updateBanner();
      this.updateList();
    }
  }

}

export { StrongFilterView };
