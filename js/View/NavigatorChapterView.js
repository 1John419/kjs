'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { kjvIdx } from '../data/kjvIdx.js';
import { kjvLists } from '../data/kjvLists.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'navigator-book', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'navigator-chapter', text: null },
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
    const chapter = kjvLists.chapters[chapterIdx];
    const btn = document.createElement('div');
    btn.classList.add('btn-chapter');
    btn.dataset.bookIdx = chapter[kjvIdx.chapter.bookIdx];
    btn.dataset.chapterIdx = chapterIdx;
    btn.dataset.chapterName = chapter[kjvIdx.chapter.name];
    const num = chapter[kjvIdx.chapter.num];
    btn.textContent = num;
    return btn;
  }

  bookIdxUpdate(bookIdx) {
    if (this.bookIdx !== bookIdx) {
      this.bookIdx = bookIdx;
      this.updateBanner();
      this.updateChapterList();
    }
  }

  buildPage() {
    this.page = template.page('navigator-chapter');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('navigator-chapter');
    this.list = template.element('div', 'list', 'navigator-chapter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  chapterIdxUpdate(chapterIdx) {
    const oldChapterIdx = this.chapterIdx || chapterIdx;
    const oldBookIdx = kjvLists.chapters[oldChapterIdx][kjvIdx.chapter.bookIdx];
    this.chapterIdx = chapterIdx;
    const bookIdx = kjvLists.chapters[this.chapterIdx][kjvIdx.chapter.bookIdx];
    if (oldBookIdx !== bookIdx) {
      this.updateBanner();
      this.updateChapterList();
    }
    this.updateActive();
  }

  contentClick(btn) {
    const chapterIdx = parseInt(btn.dataset.chapterIdx);
    queue.publish('navigator-chapter.select', chapterIdx);
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
    const btn = event.target.closest('div.btn-chapter');
    if (btn) {
      if (btn.classList.contains('btn-chapter')) {
        this.contentClick(btn);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('bookIdx.update', (bookIdx) => {
      this.bookIdxUpdate(bookIdx);
    });

    queue.subscribe('chapterIdx.update', (chapterIdx) => {
      this.chapterIdxUpdate(chapterIdx);
    });

    queue.subscribe('navigator-chapter.hide', () => {
      this.hide();
    });
    queue.subscribe('navigator-chapter.show', () => {
      this.show();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('navigator.back', null);
      } else if (btn === this.btnBook) {
        queue.publish('navigator-book', null);
      }
    }
  }

  updateActive() {
    let activeBtn = this.list.querySelector('.btn-chapter--active');
    if (activeBtn) {
      activeBtn.classList.remove('btn-chapter--active');
    }
    const selector =
      `.btn-chapter[data-chapter-idx="${this.chapterIdx}"]`;
    activeBtn = this.list.querySelector(selector);
    activeBtn.classList.add('btn-chapter--active');
  }

  updateBanner() {
    const longName = kjvLists.books[this.bookIdx][kjvIdx.book.longName];
    this.banner.innerHTML = `${longName}`;
  }

  updateChapterList() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    const list = document.createElement('div');
    list.classList.add('content', 'content--chapter');
    const book = kjvLists.books[this.bookIdx];
    const indices = util.range(book[kjvIdx.book.firstChapterIdx],
      book[kjvIdx.book.lastChapterIdx] + 1);
    for (const idx of indices) {
      const btn = this.buildBtnContent(idx);
      list.appendChild(btn);
    }
    this.list.appendChild(list);
  }

}

export { NavigatorChapterView };
