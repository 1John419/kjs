'use strict';

import { bus } from '../EventBus.js';
import {
  tomeBooks,
  tomeChapters
} from '../data/tomeDb.js';
import {
  bookFirstChapterIdx,
  bookLastChapterIdx,
  bookLongName,
  chapterBookIdx,
  chapterName,
  chapterNum
} from '../data/tomeIdx.js';
import {
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import {
  range,
  removeAllChildren
} from '../util.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'navigator-book', label: 'Book' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'navigator-chapter', text: null }
];

class NavigatorChapterView {

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

  buildBtnContent(chapterIdx) {
    let chapter = tomeChapters[chapterIdx];
    let btn = document.createElement('button');
    btn.classList.add('btn-chapter');
    btn.dataset.bookIdx = chapter[chapterBookIdx];
    btn.dataset.chapterIdx = chapterIdx;
    btn.dataset.chapterName = chapter[chapterName];
    let num = chapter[chapterNum];
    btn.textContent = num;
    btn.setAttribute('aria-label', num);
    return btn;
  }

  bookChange(bookIdx) {
    if (this.bookIdx !== bookIdx) {
      this.bookIdx = bookIdx;
      this.updateBanner();
      this.updateChapterList();
    }
  }

  buildPage() {
    this.page = templatePage('navigator-chapter');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('navigator-chapter');
    this.list = templateElement('div', 'list', 'navigator-chapter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  chapterIdxUpdate(chapterIdx) {
    let oldChapterIdx = this.chapterIdx || chapterIdx;
    let oldBookIdx = tomeChapters[oldChapterIdx][chapterBookIdx];
    this.chapterIdx = chapterIdx;
    let bookIdx = tomeChapters[this.chapterIdx][chapterBookIdx];
    if (oldBookIdx !== bookIdx) {
      this.updateBanner();
      this.updateChapterList();
    }
    this.updateActive();
  }

  contentClick(btn) {
    let chapterIdx = parseInt(btn.dataset.chapterIdx);
    bus.publish('navigator-chapter.select', chapterIdx);
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--navigator-chapter');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnBook = this.toolbarLower.querySelector('.btn-icon--navigator-book');
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
      if (target.classList.contains('btn-chapter')) {
        this.contentClick(target);
      }
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
    bus.subscribe('bookIdx.change', (bookIdx) => {
      this.bookChange(bookIdx);
    });

    bus.subscribe('chapterIdx.update', (chapterIdx) => {
      this.chapterIdxUpdate(chapterIdx);
    });

    bus.subscribe('navigator-chapter.hide', () => {
      this.hide();
    });
    bus.subscribe('navigator-chapter.show', () => {
      this.show();
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        bus.publish('navigator.back', null);
      } else if (target === this.btnBook) {
        bus.publish('navigator-book', null);
      }
    }
  }

  updateActive() {
    let activeBtn = this.list.querySelector('.btn-chapter--active');
    if (activeBtn) {
      activeBtn.classList.remove('btn-chapter--active');
    }
    let selector =
      `.btn-chapter[data-chapter-idx="${this.chapterIdx}"]`;
    activeBtn = this.list.querySelector(selector);
    activeBtn.classList.add('btn-chapter--active');
  }

  updateBanner() {
    let longName = tomeBooks[this.bookIdx][bookLongName];
    this.banner.innerHTML = `${longName}`;
  }

  updateChapterList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    let list = document.createElement('div');
    list.classList.add('content', 'content--chapter');
    let book = tomeBooks[this.bookIdx];
    let indices = range(book[bookFirstChapterIdx],
      book[bookLastChapterIdx] + 1);
    for (let idx of indices) {
      let btn = this.buildBtnContent(idx);
      list.appendChild(btn);
    }
    this.list.appendChild(list);
  }

}

export { NavigatorChapterView };
