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
  tomeBinVerseCount,
  tomeBinWordCount,
} from '../data/binIdx.js';
import {
  defDefinition,
  defLemma,
  defPronunciation,
  defTranliteration,
  wordKjvWord,
  wordTomeBin,
} from '../data/strongIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  { type: 'btn', icon: 'strong-lookup', ariaLabel: 'Strong Lookup' },
  { type: 'btn', icon: 'history', ariaLabel: 'Strong History' },
  { type: 'btn', icon: 'strong-verse', ariaLabel: 'Strong Verse' },
  { type: 'btn', icon: 'result', ariaLabel: 'Strong Result' },
  { type: 'btn', icon: 'prev', ariaLabel: 'Previous Strong' },
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
    let fragment = document.createDocumentFragment();
    let lemma = templateElement('div', 'strong-def', 'lemma', '',
      this.def[defLemma].normalize('NFC'));
    if (this.strongDef.startsWith('H')) {
      lemma.classList.add('font--hebrew');
    } else {
      lemma.classList.add('font--greek');
    }
    let xlit = templateElement('div', 'strong-def', 'xlit', '',
      this.def[defTranliteration].normalize('NFC'));
    let pron = templateElement('div', 'strong-def', 'pron', '',
      this.def[defPronunciation].normalize('NFC'));
    let definition = this.buildDefinition(this.def[defDefinition]
      .normalize('NFC'));
    fragment.appendChild(lemma);
    fragment.appendChild(xlit);
    fragment.appendChild(pron);
    fragment.appendChild(definition);
    return fragment;
  }

  buildDefinition(definition) {
    let frags = definition.split(/[HG]\d+/);
    let words = definition.match(/[HG]\d+/g);
    let defDiv = templateElement('div', 'strong-def', 'def', '', null);
    if (words) {
      frags.map((value, index) => {
        let span = document.createElement('span');
        span.textContent = value;
        defDiv.appendChild(span);
        if (words[index]) {
          let num = words[index];
          let btn = templateElement(
            'button', 'btn-strong-def', null, num, num);
          btn.dataset.strongDef = num;
          defDiv.appendChild(btn);
        }
      });
    } else {
      defDiv.textContent = definition;
    }
    return defDiv;
  }

  buildPage() {
    this.page = templatePage('strong-def');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('strong-def');
    this.list = templateElement('div', 'list', 'strong-def', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildWords() {
    let strongWords = templateElement('div', 'strong-words', null, '', null);
    for (let word of this.words) {
      let kjvWord = word[wordKjvWord];
      let tomeBin = word[wordTomeBin];
      let label =
        `${kjvWord} (${tomeBin[tomeBinWordCount]}/${tomeBin[tomeBinVerseCount]})`;
      let btn = templateElement(
        'button', 'btn-strong-word', null, label, label);
      btn.dataset.word = word[wordKjvWord];
      strongWords.appendChild(btn);
    }
    return strongWords;
  }

  chainUpdate(strongChain) {
    this.strongChain = strongChain;
    if (this.strongChain.length) {
      this.btnPrev.classList.remove('btn-icon--hide');
    } else {
      this.btnPrev.classList.add('btn-icon--hide');
    }
  }

  defClick(btn) {
    let strongDef = btn.dataset.strongDef;
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
    this.btnLookup = this.toolbarLower.querySelector(
      '.btn-icon--strong-lookup');
    this.btnVerse = this.toolbarLower.querySelector(
      '.btn-icon--strong-verse');
    this.btnHistory = this.toolbarLower.querySelector(
      '.btn-icon--history');
    this.btnResult = this.toolbarLower.querySelector(
      '.btn-icon--result');
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
    let btn = event.target.closest('button');
    if (btn) {
      if (btn.classList.contains('btn-strong-word')) {
        this.wordClick(btn);
      } else if (btn.classList.contains('btn-strong-def')) {
        this.defClick(btn);
      }
    }
  }

  scrollToTop() {
    this.scroll.scrollTop = 0;
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
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('strong.back', null);
      } else if (btn === this.btnLookup) {
        queue.publish('strong-lookup', null);
      } else if (btn === this.btnHistory) {
        queue.publish('strong-history', null);
      } else if (btn === this.btnVerse) {
        queue.publish('strong-verse', null);
      } else if (btn === this.btnResult) {
        queue.publish('strong-result', null);
      } else if (btn === this.btnPrev) {
        queue.publish('strong.prev', null);
      }
    }
  }

  updateActiveWord() {
    if (this.activeWordBtn) {
      this.activeWordBtn.classList.remove('btn-strong-word--active');
    }
    let strongWords = this.list.querySelector('.strong-words');
    if (strongWords) {
      let query = `.btn-strong-word[data-word="${this.strongWord}"]`;
      let btn = strongWords.querySelector(query);
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
    this.scrollToTop();
    removeAllChildren(this.list);
    let def = this.buildDef();
    this.list.appendChild(def);
    let strongWords = this.buildWords();
    this.list.appendChild(strongWords);
  }

  wordClick(btn) {
    let word = btn.dataset.word;
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
