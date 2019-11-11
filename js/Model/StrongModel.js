'use strict';

import { bus } from '../EventBus.js';

import { appPrefix } from '../util.js';

import { strong } from '../Tome/strong.js';

const strongDefReroute = ['strong-history', 'strong-lookup'];
const strongResultReroute = ['strong-filter'];
const validTasks = ['strong-def', 'strong-verse', 'strong-result'];

class StrongModel {

  constructor() {
    this.initialize();
  }

  addHistory() {
    if (this.strongHistory.indexOf(this.strongDef) === -1) {
      this.strongHistory = [this.strongDef, ...this.strongHistory];
      this.updateHistory();
    }
  }

  defChange(strongDef) {
    if (!strong.defs[strongDef]) {
      bus.publish('strong.def.error', 'Invalid Strong Number');
    } else {
      this.strongDef = strongDef;
      this.saveDef();
      this.addHistory();
      bus.publish('strong.def.update', this.strongDef);
    }
  }

  defIsValid(strongDef) {
    let result = false;
    if (strong.defs[strongDef]) {
      result = true;
    }
    return result;
  }

  filterChange(strongFilter) {
    this.strongFilter = strongFilter;
    this.saveFilter();
    bus.publish('strong.filter.update', this.strongFilter);
  }

  filterIsValid(filter) {
    let result = false;
    if (typeof filter === 'object') {
      if (filter.bookIdx && filter.chapterIdx) {
        result = true;
      }
    }
    return result;
  }

  filterReset() {
    let strongFilter = this.tomeFilter();
    this.filterChange(strongFilter);
  }

  historyChange(strongHistory) {
    this.strongHistory = strongHistory;
    this.saveHistory();
    bus.publish('strong.history.update', this.strongHistory);
  }

  historyClear() {
    this.strongHistory = [];
    this.updateHistory();
  }

  historyDelete(strongDef) {
    let index = this.strongHistory.indexOf(strongDef);
    this.strongHistory.splice(index, 1);
    this.updateHistory();
  }

  historyDown(strongDef) {
    let index = this.strongHistory.indexOf(strongDef);
    if (index !== (this.strongHistory.length - 1) && index !== -1) {
      this.reorderHistory(index, index + 1);
      this.updateHistory();
    }
  }

  historyIsValid(strongHistory) {
    return strongHistory.some((x) => {
      return typeof x === 'string';
    });
  }

  historyUp(strongDef) {
    let index = this.strongHistory.indexOf(strongDef);
    if (index !== 0 && index !== -1) {
      this.reorderHistory(index, index - 1);
      this.updateHistory();
    }
  }

  initialize() {
    this.subscribe();
  }

  modeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveMode();
    bus.publish('strong.strong.mode.update', this.strongMode);
  }

  modeToogle() {
    this.modeChange(!this.strongMode);
  }

  reorderHistory(fromIdx, toIdx) {
    this.strongHistory.splice(toIdx, 0, this.strongHistory.splice(fromIdx, 1)[0]);
  }

  restore() {
    this.restoreHistory();
    this.restoreDef();
    this.restoreWord();
    this.restoreFilter();
    this.restoreVerse();
    this.restoreMode();
    this.restoreTask();
  }

  restoreDef() {
    let defaultDef = 'G2424';
    let strongDef = localStorage.getItem(`${appPrefix}-strongDef`);
    if (!strongDef) {
      strongDef = defaultDef;
    } else {
      try {
        strongDef = JSON.parse(strongDef);
      } catch (error) {
        strongDef = defaultDef;
      }
      if (!this.defIsValid(strongDef)) {
        strongDef = defaultDef;
      }
    }
    this.defChange(strongDef);
  }

  restoreFilter() {
    let defaultFilter = this.tomeFilter();
    let strongFilter = localStorage.getItem(`${appPrefix}-strongFilter`);
    if (!strongFilter) {
      strongFilter = defaultFilter;
    } else {
      try {
        strongFilter = JSON.parse(strongFilter);
      } catch (error) {
        strongFilter = defaultFilter;
      }
      if (!this.filterIsValid(strongFilter)) {
        strongFilter = defaultFilter;
      }
    }
    this.filterChange(strongFilter);
  }

  restoreHistory() {
    let defaultHistory = [];
    let strongHistory = localStorage.getItem(`${appPrefix}-strongHistory`);
    if (!strongHistory) {
      strongHistory = defaultHistory;
    } else {
      try {
        strongHistory = JSON.parse(strongHistory);
      } catch (error) {
        strongHistory = defaultHistory;
      }
      if (!this.historyIsValid(strongHistory)) {
        strongHistory = defaultHistory;
      }
    }
    this.historyChange(strongHistory);
  }

  restoreMode() {
    let defaultMode = false;
    let strongMode = localStorage.getItem(`${appPrefix}-strongStrongMode`);
    if (!strongMode) {
      strongMode = defaultMode;
    } else {
      try {
        strongMode = JSON.parse(strongMode);
      } catch (error) {
        strongMode = defaultMode;
      }
      if (typeof strongMode !== 'boolean') {
        strongMode = defaultMode;
      }
    }
    this.modeChange(strongMode);
  }

  restoreTask() {
    let defaultTask = 'strong-def';
    let strongTask = localStorage.getItem(`${appPrefix}-strongTask`);
    if (!strongTask) {
      strongTask = defaultTask;
    } else {
      try {
        strongTask = JSON.parse(strongTask);
      } catch (error) {
        strongTask = defaultTask;
      }
      if (strongDefReroute.includes(strongTask)) {
        strongTask = 'strong-def';
      } else if (strongResultReroute.includes(strongTask)) {
        strongTask = 'strong-result';
      } else if (!validTasks.includes(strongTask)) {
        strongTask = defaultTask;
      }
    }
    this.taskChange(strongTask);
  }

  restoreVerse() {
    let defaultVerse = 30622;
    let strongVerse = localStorage.getItem(`${appPrefix}-strongVerse`);
    if (!strongVerse) {
      strongVerse = defaultVerse;
    } else {
      try {
        strongVerse = JSON.parse(strongVerse);
      } catch (error) {
        strongVerse = defaultVerse;
      }
      if (!Number.isInteger(strongVerse)) {
        strongVerse = defaultVerse;
      }
    }
    this.verseChange(strongVerse);
  }

  restoreWord() {
    let defaultWord = null;
    let strongWord = localStorage.getItem(`${appPrefix}-strongWord`);
    if (!strongWord) {
      strongWord = defaultWord;
    } else {
      try {
        strongWord = JSON.parse(strongWord);
      } catch (error) {
        strongWord = defaultWord;
      }
      if (typeof strongWord !== 'string') {
        strongWord = defaultWord;
      }
    }
    this.wordChange(strongWord);
  }

  saveDef() {
    localStorage.setItem(`${appPrefix}-strongDef`,
      JSON.stringify(this.strongDef));
  }

  saveFilter() {
    localStorage.setItem(`${appPrefix}-strongFilter`,
      JSON.stringify(this.strongFilter));
  }

  saveHistory() {
    localStorage.setItem(`${appPrefix}-strongHistory`,
      JSON.stringify(this.strongHistory));
  }

  saveMode() {
    localStorage.setItem(`${appPrefix}-strongStrongMode`,
      JSON.stringify(this.strongMode));
  }

  saveTask() {
    localStorage.setItem(`${appPrefix}-strongTask`,
      JSON.stringify(this.strongTask));
  }

  saveVerse() {
    localStorage.setItem(`${appPrefix}-strongVerse`,
      JSON.stringify(this.strongVerse));
  }

  saveWord() {
    localStorage.setItem(`${appPrefix}-strongWord`,
      JSON.stringify(this.strongWord));
  }

  subscribe() {
    bus.subscribe('strong.def.change', (strongDef) => {
      this.defChange(strongDef);
    });

    bus.subscribe('strong.filter.change', (strongFilter) => {
      this.filterChange(strongFilter);
    });
    bus.subscribe('strong.filter.reset', () => {
      this.filterReset();
    });

    bus.subscribe('strong.history.clear', () => {
      this.historyClear();
    });
    bus.subscribe('strong.history.delete', (strongDef) => {
      this.historyDelete(strongDef);
    });
    bus.subscribe('strong.history.down', (strongDef) => {
      this.historyDown(strongDef);
    });
    bus.subscribe('strong.history.up', (strongDef) => {
      this.historyUp(strongDef);
    });

    bus.subscribe('strong.restore', () => {
      this.restore();
    });
    bus.subscribe('strong.strong.mode.toggle', () => {
      this.modeToogle();
    });
    bus.subscribe('strong.task.change', (strongTask) => {
      this.taskChange(strongTask);
    });
    bus.subscribe('strong.verse.change', (verseIdx) => {
      this.verseChange(verseIdx);
    });
    bus.subscribe('strong.word.change', (strongWord) => {
      this.wordChange(strongWord);
    });
    bus.subscribe('strong.word.first', () => {
      this.wordFirst();
    });
  }

  taskChange(strongTask) {
    this.strongTask = strongTask;
    this.saveTask();
    bus.publish('strong.task.update', this.strongTask);
  }

  tomeFilter() {
    return {
      bookIdx: -1,
      chapterIdx: -1
    };
  }

  updateHistory() {
    this.saveHistory();
    bus.publish('strong.history.update', this.strongHistory);
  }

  verseChange(verseIdx) {
    this.strongVerse = verseIdx;
    this.saveVerse();
    bus.publish('strong.verse.update', this.strongVerse);
  }

  wordChange(strongWord) {
    this.strongWord = strongWord;
    this.saveWord();
    bus.publish('strong.word.update', this.strongWord);
  }

  wordFirst() {
    let firstWord = Object.keys(strong.words[this.strongDef])[0];
    this.wordChange(firstWord);
  }

}

export { StrongModel };
