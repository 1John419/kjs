'use strict';

import { queue } from '../CommandQueue.js';
import {
  verseCitation,
  verseText
} from '../data/tomeIdx.js';
import {
  mapSliceEnd,
  mapSliceStart,
  mapStrongNums
} from '../data/strongIdx.js';
import {
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

  getVerseWords() {
    let clean_verse = this.verse[verseText].replace(/[,.?;:!()-]/g, '');
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
      queue.publish('strong-verse.select', strongDef);
    }
  }

  mapUpdate(strongMapObj) {
    this.strongMapObj = strongMapObj;
    this.maps = this.strongMapObj.v;
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

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
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        queue.publish('strong.back', null);
      } else if (target === this.btnStrongDef) {
        queue.publish('strong-def', null);
      } else if (target === this.btnResult) {
        queue.publish('strong-result', null);
      }
    }
  }

  updateBanner() {
    this.banner.textContent = this.verse[verseCitation];
  }

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    let docFragment = document.createDocumentFragment();
    this.getVerseWords();
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
    this.updateList();
  }

}

export { StrongVerseView };
