'use strict';

import { bus } from '../EventBus.js';

import { strong } from '../Tome/strong.js';

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
  { type: 'btn', icon: 'strong-lookup', label: 'Strong Lookup' },
  { type: 'btn', icon: 'history', label: 'Strong History' },
  { type: 'btn', icon: 'strong-verse', label: 'Strong Verse' },
  { type: 'btn', icon: 'result', label: 'Strong Result' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'strong-def', text: 'Strong Definition' }
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
    let def = strong.defs[this.strongDef];
    let fragment = document.createDocumentFragment();
    let lemma = templateElement(
      'div', 'strong-def', 'lemma', 'Lemma', def[0]);
    let xlit = templateElement(
      'div', 'strong-def', 'xlit', 'Transliteration', def[1]);
    let pron = templateElement(
      'div', 'strong-def', 'pron', 'Pronunciation', def[2]);
    let definition = this.buildDefinition(def[3]);
    fragment.appendChild(lemma);
    fragment.appendChild(xlit);
    fragment.appendChild(pron);
    fragment.appendChild(definition);
    return fragment;
  }

  buildDefinition(definition) {
    let frags = definition.split(/[HG]\d+/);
    let nums = definition.match(/[HG]\d+/g);
    let defDiv = templateElement(
      'div', 'strong-def', 'def', 'Definition', null);
    if (nums) {
      frags.map((value, index) => {
        let span = document.createElement('span');
        span.textContent = value;
        defDiv.appendChild(span);
        if (nums[index]) {
          let num = nums[index];
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
    let kjvWords = strong.words[this.strongDef];
    let strongWords = templateElement(
      'div', 'strong-words', null, 'Strong Words', null);
    for (let kjvWord in kjvWords) {
      let word = kjvWords[kjvWord];
      let label = `${kjvWord} (${word[0]}/${word[1]})`;
      let btn = templateElement(
        'button', 'btn-strong-word', null, label, label);
      btn.dataset.word = kjvWord;
      strongWords.appendChild(btn);
    }
    return strongWords;
  }

  defClick(btn) {
    let strongDef = btn.dataset.strongDef;
    bus.publish('strong-def.select', strongDef);
  }

  defUpdate(strongDef) {
    this.strongDef = strongDef;
    this.updateBanner();
    this.updateList();
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
      if (target.classList.contains('btn-strong-word')) {
        this.wordClick(target);
      } else if (target.classList.contains('btn-strong-def')) {
        this.defClick(target);
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
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('strong-def.hide', () => {
      this.hide();
    });
    bus.subscribe('strong-def.show', () => {
      this.show();
    });

    bus.subscribe('strong.def.update', (strongDef) => {
      this.defUpdate(strongDef);
    });
    bus.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        bus.publish('strong.back', null);
      } else if (target === this.btnLookup) {
        bus.publish('strong-lookup', null);
      } else if (target === this.btnHistory) {
        bus.publish('strong-history', null);
      } else if (target === this.btnVerse) {
        bus.publish('strong-verse', null);
      } else if (target === this.btnResult) {
        bus.publish('strong-result', null);
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

  updateList() {
    this.scrollToTop();
    removeAllChildren(this.list);
    let def = this.buildDef();
    this.list.appendChild(def);
    let strongWords = this.buildWords();
    this.list.appendChild(strongWords);
  }

  wordClick(btn) {
    let word = btn.dataset.word;
    bus.publish('strong-def.word.select', word);
  }

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
    if (this.strongWord) {
      this.updateActiveWord();
    }
  }

}

export { StrongDefView };
