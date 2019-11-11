'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import { strong } from '../Tome/strong.js';

import {
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

import {
  getRefName,
  removeAllChildren
} from '../util.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'strong-def', label: 'Strong Definition' },
  { type: 'btn', icon: 'result', label: 'Strong Search' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-verse', text: 'Strong Verse' }
];

class StrongVerseView {

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

  buildPage() {
    this.page = templatePage('strong-verse');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('strong-verse');
    this.list = templateElement('div', 'list', 'strong-verse', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildStrongFragemnt(fragment) {
    let text = this.verseWords.slice(fragment[0], fragment[1])
      .join(' ');
    let strongFragment = templateElement('div', 'strong-fragment',
      null, null, null);
    let verseFragment = templateElement('div', 'verse-fragment',
      null, null, text);
    let strongList = templateElement('div', 'strong-list',
      null, null, null);
    for (let num of fragment[2]) {
      let btn = templateElement('button', 'btn-strong',
        null, null, num);
      btn.dataset.strongDef = num.replace(/[()]/g, '');
      strongList.appendChild(btn);
    }
    strongFragment.appendChild(verseFragment);
    strongFragment.appendChild(strongList);
    return strongFragment;
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--strong-verse');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnStrongDef = this.toolbarLower.querySelector(
      '.btn-icon--strong-def');
    this.btnResult = this.toolbarLower.querySelector(
      '.btn-icon--result');
  }

  getVerseWords() {
    let verse = tome.verses[this.strongVerse];
    let clean_verse = verse.replace(/[,.?;:!()-]/g, '');
    this.verseWords = clean_verse.split(' ');
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
    let target = event.target;
    if (target.classList.contains('btn-strong')) {
      let strongDef = target.dataset.strongDef;
      bus.publish('strong-verse.select', strongDef);
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

  strongVerseUpdate(verseIdx) {
    this.strongVerse = verseIdx;
    if (this.strongVerse >= 0) {
      this.updateBanner();
      this.updateList();
    }
  }

  subscribe() {
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('strong-verse.hide', () => {
      this.hide();
    });
    bus.subscribe('strong-verse.show', () => {
      this.show();
    });

    bus.subscribe('strong.verse.update', (verseIdx) => {
      this.strongVerseUpdate(verseIdx);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        bus.publish('strong.back', null);
      } else if (target === this.btnStrongDef) {
        bus.publish('strong-def', null);
      } else if (target === this.btnResult) {
        bus.publish('strong-result', null);
      }
    }
  }

  updateBanner() {
    if (this.strongVerse >= 0) {
      this.banner.textContent = getRefName(this.strongVerse);
    }
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    let docFragment = document.createDocumentFragment();
    this.getVerseWords();
    for (let fragment of strong.fragments[this.strongVerse]) {
      let strongFragment = this.buildStrongFragemnt(fragment);
      docFragment.appendChild(strongFragment);
    }
    this.list.appendChild(docFragment);
  }

}

export { StrongVerseView };
