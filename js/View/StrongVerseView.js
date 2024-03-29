'use strict';

import {
  queue,
} from '../CommandQueue.js';
import {
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
  verseCitation,
  verseText,
} from '../data/tomeIdx.js';
import {
  mapSliceEnd,
  mapSliceStart,
  mapStrongNums,
} from '../data/strongIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  { type: 'btn', icon: 'strong-def', ariaLabel: 'Strong Definition' },
  { type: 'btn', icon: 'result', ariaLabel: 'Strong Search' },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'strong-verse', text: 'Strong Verse' },
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

  buildStrongFragment(map) {
    let text = this.verseWords.slice(map[mapSliceStart], map[mapSliceEnd])
      .join(' ');
    let strongFragment = templateElement('div', 'strong-fragment',
      null, null, null);
    let verseFragment = templateElement('div', 'verse-fragment',
      null, null, text);
    let strongList = templateElement('div', 'strong-list',
      null, null, null);
    for (let num of map[mapStrongNums]) {
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
    let btn = event.target.closest('button');
    if (btn.classList.contains('btn-strong')) {
      let strongDef = btn.dataset.strongDef;
      queue.publish('strong-verse.select', strongDef);
    }
  }

  mapUpdate(strongMapObj) {
    this.strongMapObj = strongMapObj;
    this.maps = this.strongMapObj.v;
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('strong-verse.hide', () => {
      this.hide();
    });
    queue.subscribe('strong-verse.show', () => {
      this.show();
    });

    queue.subscribe('strong.map.update', (strongMapObj) => {
      this.mapUpdate(strongMapObj);
    });
    queue.subscribe('strong.verse.update', (strongVerseObj) => {
      this.verseUpdate(strongVerseObj);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('strong.back', null);
      } else if (btn === this.btnStrongDef) {
        queue.publish('strong-def', null);
      } else if (btn === this.btnResult) {
        queue.publish('strong-result', null);
      }
    }
  }

  updateBanner() {
    this.banner.textContent = this.verse[verseCitation];
  }

  updateVerse() {
    this.scrollToTop();
    removeAllChildren(this.list);
    let docFragment = document.createDocumentFragment();
    this.verseWords = this.verse[verseText].split(' ');
    for (let map of this.maps) {
      let strongMap = this.buildStrongFragment(map);
      docFragment.appendChild(strongMap);
    }
    this.list.appendChild(docFragment);
  }

  verseUpdate(strongVerseObj) {
    this.strongVerseObj = strongVerseObj;
    this.strongVerse = this.strongVerseObj.k;
    this.verse = this.strongVerseObj.v;
    this.updateBanner();
    this.updateVerse();
  }

}

export { StrongVerseView };
