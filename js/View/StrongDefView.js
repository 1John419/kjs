'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { util } from '../util.js';
import { binIdx } from '../data/binIdx.js';
import { strongIdx } from '../data/strongIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'strong-lookup', ariaLabel: null },
  { type: 'btn', icon: 'result', ariaLabel: null },
  { type: 'btn', icon: 'filter', ariaLabel: null },
  { type: 'btn', icon: 'history', ariaLabel: null },
  { type: 'btn', icon: 'strong-verse', ariaLabel: null },
  { type: 'btn', icon: 'prev', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'strong-def', text: 'Strong Definition' },
];

class StrongDefView {

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

  buildDef() {
    const fragment = document.createDocumentFragment();
    const lemma = template.element('div', 'strong-def', 'lemma', null, this.def[strongIdx.def.lemma].normalize('NFC'));
    if (this.strongDef.startsWith('H')) {
      lemma.classList.add('font--hebrew');
    } else {
      lemma.classList.add('font--greek');
    }
    const xlit = template.element('div', 'strong-def', 'xlit', null, this.def[strongIdx.def.tranliteration].normalize('NFC'));
    const pron = template.element('div', 'strong-def', 'pron', null, this.def[strongIdx.def.pronunciation].normalize('NFC'));
    const definition = this.buildDefinition();
    fragment.appendChild(lemma);
    fragment.appendChild(xlit);
    fragment.appendChild(pron);
    fragment.appendChild(definition);
    return fragment;
  }

  buildDefinition(definition) {
    const defDiv = template.element('div', 'strong-def', 'def', null, null);
    const deriv = template.strongList(this.def[strongIdx.def.deriv], 'deriv');
    defDiv.appendChild(deriv);
    const strongDef = template.strongList(this.def[strongIdx.def.strongDef], 'strong-def');
    defDiv.appendChild(strongDef);
    const kjvDef = template.strongList(this.def[strongIdx.def.kjvDef], 'kjv-def');
    defDiv.appendChild(kjvDef);
    return defDiv;
  }

  buildPage() {
    this.page = template.page('strong-def');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('strong-def');
    this.list = template.element('div', 'list', 'strong-def', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildWords() {
    const strongWords = template.element('div', 'strong-words', null, null, null);
    for (const word of this.words) {
      const kjvWord = word[strongIdx.word.kjvWord];
      const kjvBin = word[strongIdx.word.kjvBin];
      const label =
        `${kjvWord} (${kjvBin[binIdx.kjvBinIdx.wordCount]}/${kjvBin[binIdx.kjvBinIdx.verseCount]})`;
      const btn = template.element('div', 'btn-strong-word', null, null, label);
      btn.dataset.word = word[strongIdx.word.kjvWord];
      strongWords.appendChild(btn);
    }
    return strongWords;
  }

  chainUpdate(strongChain) {
    this.strongChain = strongChain;
    if (this.strongChain.length) {
      this.btnPrev.classList.remove('hide');
    } else {
      this.btnPrev.classList.add('hide');
    }
  }

  defClick(btn) {
    const strongDef = btn.dataset.strongDef;
    queue.publish('strong-def.select', strongDef);
  }

  defUpdate(strongDefObj) {
    this.strongDefObj = strongDefObj;
    this.strongDef = this.strongDefObj.k;
    this.def = this.strongDefObj.v;
    this.updateBanner();
    this.updateDefs();
    this.updateActiveWord();
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--strong-def');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnLookup = this.toolbarLower.querySelector('.btn-icon--strong-lookup');
    this.btnResult = this.toolbarLower.querySelector('.btn-icon--result');
    this.btnFilter = this.toolbarLower.querySelector('.btn-icon--filter');
    this.btnHistory = this.toolbarLower.querySelector('.btn-icon--history');
    this.btnVerse = this.toolbarLower.querySelector('.btn-icon--strong-verse');
    this.btnPrev = this.toolbarLower.querySelector('.btn-icon--prev');
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
      if (btn.classList.contains('btn-strong-word')) {
        this.wordClick(btn);
      } else if (btn.classList.contains('btn-strong-def')) {
        this.defClick(btn);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('strong-def.hide', () => {
      this.hide();
    });
    queue.subscribe('strong-def.show', () => {
      this.show();
    });

    queue.subscribe('strong.chain.update', (strongChain) => {
      this.chainUpdate(strongChain);
    });
    queue.subscribe('strong.def.update', (strongDefObj) => {
      this.defUpdate(strongDefObj);
    });
    queue.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
    });
    queue.subscribe('strong.wordObj.update', (strongWordObj) => {
      this.wordObjUpdate(strongWordObj);
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
      } else if (btn === this.btnResult) {
        queue.publish('strong-result', null);
      } else if (btn === this.btnFilter) {
        queue.publish('strong-filter', null);
      } else if (btn === this.btnHistory) {
        queue.publish('strong-history', null);
      } else if (btn === this.btnVerse) {
        queue.publish('strong-verse', null);
      } else if (btn === this.btnPrev) {
        queue.publish('strong.prev', null);
      }
    }
  }

  updateActiveWord() {
    if (this.activeWordBtn) {
      this.activeWordBtn.classList.remove('btn-strong-word--active');
    }
    const strongWords = this.list.querySelector('.strong-words');
    if (strongWords) {
      const query = `.btn-strong-word[data-word="${this.strongWord}"]`;
      const btn = strongWords.querySelector(query);
      if (btn) {
        btn.classList.add('btn-strong-word--active');
        this.activeWordBtn = btn;
      }
    }
  }

  updateBanner() {
    if (this.strongDef) {
      this.banner.textContent = this.strongDef;
    }
  }

  updateDefs() {
    this.scroll.scrollTop = 0;
    util.removeAllChildren(this.list);
    const def = this.buildDef();
    this.list.appendChild(def);
    const strongWords = this.buildWords();
    this.list.appendChild(strongWords);
  }

  wordClick(btn) {
    const word = btn.dataset.word;
    queue.publish('strong-def.word.select', word);
  }

  wordObjUpdate(strongWordObj) {
    this.strongWordObj = strongWordObj;
    this.words = this.strongWordObj.v;
  }

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
    if (this.strongWord) {
      this.updateActiveWord();
    }
  }

}

export { StrongDefView };
