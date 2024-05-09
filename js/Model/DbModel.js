'use strict';

import { queue } from '../CommandQueue.js';
import { kjvPureDb, kjvPureName, kjvPureWords } from '../data/kjvPureDb.js';
import { kjvNameDb, kjvNameName, kjvNameWords } from '../data/kjvNameDb.js';
import { strongNameDb } from '../data/strongNameDb.js';
import { strongPureDb } from '../data/strongPureDb.js';

export let kjvDb = null;
export let kjvWords = null;
export let kjvName = null;
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

  kjvDbChange() {
    if (this.nameMode === true) {
      kjvDb = kjvNameDb;
      kjvWords = kjvNameWords;
      kjvName = kjvNameName;
    } else {
      kjvDb = kjvPureDb;
      kjvWords = kjvPureWords;
      kjvName = kjvPureName;
    }
  }

  nameModeChange() {
    this.nameMode = !this.nameMode;
    this.saveNameMode();
    dbNameMode = this.nameMode;
    this.kjvDbChange();
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
    this.kjvDbChange();
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
