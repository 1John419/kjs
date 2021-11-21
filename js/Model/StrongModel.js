'use strict';

import queue from '../CommandQueue.js';
import { tomeBinVerses } from '../data/binIdx.js';
import {
  strongDb,
  strongNums
} from '../data/strongDb.js';
import {
  wordKjvWord,
  wordTomeBin
} from '../data/strongIdx.js';
import { tomeDb } from '../data/tomeDb.js';
import { appPrefix } from '../util.js';

const strongDefReroute = ['strong-history', 'strong-lookup'];
const strongResultReroute = ['strong-filter'];
const validTasks = ['strong-def', 'strong-verse', 'strong-result'];

const firstWord = 0;

const IDX_1_JOHN_4_19 = 30622;

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

  chainAdd() {
    this.strongChain.push(this.strongDef);
    this.updateChain();
  }

  chainChange(strongChain) {
    this.strongChain = strongChain;
    this.updateChain();
    queue.publish('strong.chain.update', this.strongChain);
  }

  chainClear() {
    this.strongChain = [];
    this.updateChain();
  }

  chainIsValid(strongChain) {
    return strongChain.some((x) => {
      return typeof x === 'string';
    });
  }

  chainPrev() {
    if (this.strongChain.length == 0) {
      return;
    }
    let strongDef = this.strongChain.pop();
    this.updateChain();
    this.defChange(strongDef);
  }

  async defChange(strongDef) {
    if (!strongNums.includes(strongDef)) {
      queue.publish('strong.def.error', 'Invalid Strong Number');
    } else {
      this.strongDef = strongDef;
      this.saveDef();
      this.addHistory();
      await this.defUpdate();
    }
  }

  async defUpdate() {
    this.strongIdx = this.strongHistory.indexOf(this.strongDef);
    this.strongDefObj = await strongDb.defs.get(this.strongDef);
    await this.updateWordObj();
    await this.wordFirst();
    queue.publish('strong.def.update', this.strongDefObj);
  }

  filterChange(strongFilter) {
    this.strongFilter = strongFilter;
    this.saveFilter();
    queue.publish('strong.filter.update', this.strongFilter);
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
    queue.publish('strong.history.update', this.strongHistory);
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

  historyIsValid(strongHistory) {
    return strongHistory.some((x) => {
      return typeof x === 'string';
    });
  }

  initialize() {
    this.subscribe();
  }

  modeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveMode();
    queue.publish('strong.strong-mode.update', this.strongMode);
  }

  modeToogle() {
    this.modeChange(!this.strongMode);
  }

  async restore() {
    this.restoreTask();
    this.restoreHistory();
    this.restoreChain();
    await this.restoreDef();
    this.strongIdx = this.strongHistory.findIndex(x => x === this.strongDef);
    await this.restoreWord();
    this.restoreFilter();
    await this.restoreVerseIdx();
    this.restoreMode();
  }

  restoreChain() {
    let defaultChain = [];
    let strongChain = localStorage.getItem(`${appPrefix}-strongChain`);
    if (!strongChain) {
      strongChain = defaultChain;
    } else {
      try {
        strongChain = JSON.parse(strongChain);
      } catch (error) {
        strongChain = defaultChain;
      }
      if (!this.chainIsValid(strongChain)) {
        strongChain = defaultChain;
      }
    }
    this.chainChange(strongChain);
  }

  async restoreDef() {
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
      if (!strongNums.includes(strongDef)) {
        strongDef = defaultDef;
      }
    }
    await this.defChange(strongDef);
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

  async restoreVerseIdx() {
    let defaultVerseIdx = IDX_1_JOHN_4_19;
    let strongVerseIdx = localStorage.getItem(`${appPrefix}-strongVerseIdx`);
    if (!strongVerseIdx) {
      strongVerseIdx = defaultVerseIdx;
    } else {
      try {
        strongVerseIdx = JSON.parse(strongVerseIdx);
      } catch (error) {
        strongVerseIdx = defaultVerseIdx;
      }
      if (!Number.isInteger(strongVerseIdx)) {
        strongVerseIdx = defaultVerseIdx;
      }
    }
    await this.verseIdxChange(strongVerseIdx);
  }

  async restoreWord() {
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
    await this.wordChange(strongWord);
  }

  saveChain() {
    localStorage.setItem(`${appPrefix}-strongChain`,
      JSON.stringify(this.strongChain));
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

  saveVerseIdx() {
    localStorage.setItem(`${appPrefix}-strongVerseIdx`,
      JSON.stringify(this.strongVerseIdx));
  }

  saveWord() {
    localStorage.setItem(`${appPrefix}-strongWord`,
      JSON.stringify(this.strongWord));
  }

  subscribe() {
    queue.subscribe('strong.chain.add', () => {
      this.chainAdd();
    });
    queue.subscribe('strong.chain.prev', () => {
      this.chainPrev();
    });
    queue.subscribe('strong.chain.clear', () => {
      this.chainClear();
    });

    queue.subscribe('strong.def.change', async (strongDef) => {
      await this.defChange(strongDef);
    });

    queue.subscribe('strong.filter.change', (strongFilter) => {
      this.filterChange(strongFilter);
    });

    queue.subscribe('strong.history.clear', () => {
      this.historyClear();
    });
    queue.subscribe('strong.history.delete', (strongDef) => {
      this.historyDelete(strongDef);
    });

    queue.subscribe('strong.restore', async () => {
      await this.restore();
    });
    queue.subscribe('strong.strong-mode.toggle', () => {
      this.modeToogle();
    });
    queue.subscribe('strong.task.change', (strongTask) => {
      this.taskChange(strongTask);
    });
    queue.subscribe('strong.verse.change', async (verseIdx) => {
      await this.verseIdxChange(verseIdx);
    });
    queue.subscribe('strong.word.change', async (strongWord) => {
      await this.wordChange(strongWord);
    });
  }

  taskChange(strongTask) {
    this.strongTask = strongTask;
    this.saveTask();
    queue.publish('strong.task.update', this.strongTask);
  }

  tomeFilter() {
    return {
      bookIdx: -1,
      chapterIdx: -1
    };
  }

  updateChain() {
    this.saveChain();
    queue.publish('strong.chain.update', this.strongChain);
  }

  updateHistory() {
    this.saveHistory();
    queue.publish('strong.history.update', this.strongHistory);
  }

  async updateWordMaps() {
    if (this.words.length) {
      let verses = this.wordTomeBin[tomeBinVerses];
      this.wordMapObjs = await strongDb.maps.bulkGet(verses);
      queue.publish('strong.wordMap.update', this.wordMapObjs);
    } else {
      this.wordMapObjs = [];
      queue.publish('strong.wordMap.update', this.wordMapObjs);
    }
  }

  async updateWordObj() {
    this.strongWordObj = await strongDb.words.get(this.strongDef);
    this.words = this.strongWordObj.v;
    queue.publish('strong.wordObj.update', this.strongWordObj);
  }

  async updateWordVerses() {
    if (this.words.length) {
      let word = this.words.find(x => x[wordKjvWord] === this.strongWord);
      this.wordTomeBin = word[wordTomeBin];
      queue.publish('strong.wordTomeBin.update', this.wordTomeBin);
      let verses = this.wordTomeBin[tomeBinVerses];
      this.wordVerseObjs = await tomeDb.verses.bulkGet(verses);
      queue.publish('strong.wordVerse.update', this.wordVerseObjs);
    } else {
      this.wordTomeBin = [];
      queue.publish('strong.wordTomeBin.update', this.wordTomeBin);
      this.wordVerseObjs = [];
      queue.publish('strong.wordVerse.update', this.wordVerseObjs);
    }
  }

  async verseIdxChange(verseIdx) {
    this.strongVerseIdx = verseIdx;
    this.saveVerseIdx();
    this.strongMapObj = await strongDb.maps.get(this.strongVerseIdx);
    queue.publish('strong.map.update', this.strongMapObj);
    this.strongVerseObj = await tomeDb.verses.get(this.strongVerseIdx);
    queue.publish('strong.verse.update', this.strongVerseObj);
  }

  async wordChange(strongWord) {
    this.strongWord = strongWord;
    this.saveWord();
    if (this.words.length) {
      let word = this.words.find(x => x[wordKjvWord] === this.strongWord);
      this.wordTomeBin = word[wordTomeBin];
    } else {
      this.wordTomeBin = [];
    }
    await this.updateWordVerses();
    await this.updateWordMaps();
    this.filterReset();
    queue.publish('strong.word.update', this.strongWord);
  }

  async wordFirst() {
    let firstKjvWord;
    if (this.words.length) {
      firstKjvWord = this.words[firstWord][wordKjvWord];
    } else {
      firstKjvWord = null;
    }
    await this.wordChange(firstKjvWord);
  }

}

export { StrongModel };
