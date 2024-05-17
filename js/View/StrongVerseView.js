'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { tomeIdx } from '../data/tomeIdx.js';
import { strongIdx } from '../data/strongIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
  { type: 'btn', icon: 'strong-def', ariaLabel: null },
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
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
    this.page = template.page('strong-verse');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('strong-verse');
    this.list = template.element('div', 'list', 'strong-verse', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildStrongFragment(map) {
    const text = map[strongIdx.map.verseFragment];
    const strongFragment = template.element('div', 'strong-fragment', null, null, null);
    const verseFragment = template.element('div', 'verse-fragment', null, null, text);
    const strongList = template.element('div', 'strong-list', null, null, null);
    for (const num of map[strongIdx.map.strongNums]) {
      const btn = template.element('div', 'btn-strong', null, null, num);
      btn.dataset.strongDef = num.replace(/@/g, '');
      strongList.appendChild(btn);
    }
    strongFragment.appendChild(verseFragment);
    strongFragment.appendChild(strongList);
    return strongFragment;
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--strong-verse');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
    this.btnDef = this.toolbarLower.querySelector('.btn-icon--strong-def');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
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
    const btn = event.target.closest('div.btn-strong');
    if (btn) {
      if (btn.classList.contains('btn-strong')) {
        const strongDef = btn.dataset.strongDef;
        queue.publish('strong-verse.select', strongDef);
      }
    }
  }

  mapUpdate(strongMapObj) {
    this.strongMapObj = strongMapObj;
    this.maps = this.strongMapObj.v;
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
      } else if (btn === this.btnFilter) {
        queue.publish('strong-filter', null);
      } else if (btn === this.btnHistory) {
        queue.publish('strong-history', null);
      }
    }
  }

  updateBanner() {
    this.banner.textContent = this.verse[tomeIdx.verse.citation];
  }

  updateVerse() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    const docFragment = document.createDocumentFragment();
    this.verseWords = this.verse[tomeIdx.verse.text].split(' ');
    for (const map of this.maps) {
      const strongMap = this.buildStrongFragment(map);
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
