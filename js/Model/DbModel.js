'use strict';

import { queue } from '../CommandQueue.js';
import { kjvPureDb, kjvPureVerseCount, kjvPureWords } from '../data/kjvPureDb.js';
import { kjvNameDb, kjvNameVerseCount, kjvNameWords } from '../data/kjvNameDb.js';
import { strongNameDb } from '../data/strongNameDb.js';
import { strongPureDb } from '../data/strongPureDb.js';

export let tomeDb = null;
export let tomeVerseCount = null;
export let tomeWords = null;
export let dbNameMode = null;
export let strongDb = null;
export let strongName = null;

class DbModel {

  constructor() {
    this.initialize();
  }

  initialize() {
    this.subscribe();
  }

  tomeDbChange() {
    if (this.nameMode === true) {
      tomeDb = kjvNameDb;
      tomeVerseCount = kjvNameVerseCount;
      tomeWords = kjvNameWords;
    } else {
      tomeDb = kjvPureDb;
      tomeVerseCount = kjvPureVerseCount;
      tomeWords = kjvPureWords;
    }
  }

  nameModeChange() {
    this.nameMode = !this.nameMode;
    this.saveNameMode();
    dbNameMode = this.nameMode;
    this.tomeDbChange();
    this.strongDbChange();
    queue.publish('name-mode.update', this.nameMode);
  }

  restore() {
    this.restoreNameMode();
  }

  restoreNameMode() {
    const defaultNameMode = false;
    let nameMode = localStorage.getItem('nameMode');
    if (!nameMode) {
      nameMode = defaultNameMode;
    } else {
      try {
        nameMode = JSON.parse(nameMode);
      } catch (error) {
        nameMode = defaultNameMode;
      }
      if (typeof nameMode !== 'boolean') {
        nameMode = defaultNameMode;
      }
    }
    this.nameMode = nameMode;
    dbNameMode = this.nameMode;
    this.tomeDbChange();
    this.strongDbChange();
  }

  saveNameMode() {
    localStorage.setItem('nameMode',
      JSON.stringify(this.nameMode));
  }

  strongDbChange() {
    if (this.nameMode === true) {
      strongDb = strongNameDb;
      strongName = 'strong_name';
    } else {
      strongDb = strongPureDb;
      strongName = 'strong_pure';
    }
  }

  subscribe() {
    queue.subscribe('db.restore', () => {
      this.restore();
    });
    queue.subscribe('name-mode.change', () => {
      this.nameModeChange();
    });
  }

}

export { DbModel };
