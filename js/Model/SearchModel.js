'use strict';

import queue from '../CommandQueue.js';
import { SearchEngine } from '../SearchEngine.js';
import { tomeBinVerses } from '../data/binIdx.js';
import { tomeDb } from '../data/tomeDb.js';
import { appPrefix } from '../util.js';

const searchResultReroute = ['search-filter', 'search-history'];
const validTasks = ['search-result', 'search-lookup', 'search-filter',
  'search-history'
];

const DEFAULT_QUERY = 'day of the lord';

const firstEntry = 0;

class SearchModel {

  constructor() {
    this.initialize();
  }

  addHistory() {
    if (this.searchHistory.indexOf(this.searchQuery) === -1) {
      this.searchHistory = [this.searchQuery, ...this.searchHistory];
      this.updateHistory();
    }
  }

  filterChange(searchFilter) {
    this.searchFilter = searchFilter;
    this.saveFilter();
    queue.publish('search.filter.update', this.searchFilter);
  }

  filterIsValid(searchFilter) {
    let result = false;
    if (typeof searchFilter === 'object') {
      if (searchFilter.bookIdx && searchFilter.chapterIdx) {
        result = true;
      }
    }
    return result;
  }

  historyChange(searchHistory) {
    this.searchHistory = searchHistory;
    this.saveHistory();
    queue.publish('search.history.update', this.searchHistory);
  }

  historyClear() {
    this.searchHistory = [];
    this.updateHistory();
  }

  historyDelete(str) {
    let index = this.searchHistory.indexOf(str);
    this.searchHistory.splice(index, 1);
    this.updateHistory();
  }

  historyDown(str) {
    let index = this.searchHistory.indexOf(str);
    if (index !== (this.searchHistory.length - 1) && index !== -1) {
      this.reorderHistory(index, index + 1);
      this.updateHistory();
    }
  }

  historyIsValid(searchHistory) {
    return searchHistory.some((x) => {
      return typeof x === 'string';
    });
  }

  historyUp(str) {
    let index = this.searchHistory.indexOf(str);
    if (index !== 0 && index !== -1) {
      this.reorderHistory(index, index - 1);
      this.updateHistory();
    }
  }

  initialize() {
    this.engine = new SearchEngine();
    this.subscribe();
  }

  modeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveStrongMode();
    queue.publish('search.strong-mode.update', this.strongMode);
  }

  modeToogle() {
    this.modeChange(!this.strongMode);
  }

  async queryChange(searchQuery) {
    let rig = await this.engine.performSearch(searchQuery);
    if (rig.state === 'ERROR') {
      let message;
      if (rig.type === 'EMPTY') {
        message = 'Enter a search expression.';
      } else if (rig.type === 'INVALID') {
        message = 'Invalid query expression.';
      } else if (rig.wordStatus !== 'OK') {
        message = rig.wordStatus;
      }
      queue.publish('search.query.error', message);
    } else {
      this.rig = rig;
      this.searchQuery = searchQuery;
      this.saveQuery();
      this.addHistory();
      await this.updateSearchVerses();
      queue.publish('rig.update', this.rig);
      this.resetFilter();
      queue.publish('search.query.update', this.searchQuery);
    }
  }

  reorderHistory(fromIdx, toIdx) {
    this.searchHistory.splice(toIdx, 0,
      this.searchHistory.splice(fromIdx, 1)[firstEntry]);
  }

  resetFilter() {
    let filter = this.tomeFilter();
    this.filterChange(filter);
  }

  async restore() {
    this.restoreTask();
    this.restoreHistory();
    await this.restoreQuery();
    this.restoreFilter();
    this.restoreMode();
  }

  restoreFilter() {
    let defaultFilter = this.tomeFilter();
    let searchFilter = localStorage.getItem(`${appPrefix}-searchFilter`);
    if (!searchFilter) {
      searchFilter = defaultFilter;
    } else {
      try {
        searchFilter = JSON.parse(searchFilter);
      } catch (error) {
        searchFilter = defaultFilter;
      }
      if (!this.filterIsValid(searchFilter)) {
        searchFilter = defaultFilter;
      }
    }
    this.filterChange(searchFilter);
  }

  restoreHistory() {
    let defaultHistory = [];
    let searchHistory = localStorage.getItem(`${appPrefix}-searchHistory`);
    if (!searchHistory) {
      searchHistory = defaultHistory;
    } else {
      try {
        searchHistory = JSON.parse(searchHistory);
      } catch (error) {
        searchHistory = defaultHistory;
      }
      if (!Array.isArray(searchHistory)) {
        searchHistory = defaultHistory;
      } else {
        if (!this.historyIsValid(searchHistory)) {
          searchHistory = defaultHistory;
        }
      }
    }
    this.historyChange(searchHistory);
  }

  restoreMode() {
    let defaultMode = false;
    let strongMode = localStorage.getItem(`${appPrefix}-searchStrongMode`);
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

  async restoreQuery() {
    let defaultQuery = DEFAULT_QUERY;
    let searchQuery = localStorage.getItem(`${appPrefix}-searchQuery`);
    if (!searchQuery) {
      searchQuery = defaultQuery;
    } else {
      try {
        searchQuery = JSON.parse(searchQuery);
      } catch (error) {
        searchQuery = defaultQuery;
      }
      if (typeof searchQuery !== 'string') {
        searchQuery = defaultQuery;
      }
    }
    await this.queryChange(searchQuery);
  }

  restoreTask() {
    let defaultTask = 'search-result';
    let searchTask = localStorage.getItem(`${appPrefix}-searchTask`);
    if (!searchTask) {
      searchTask = defaultTask;
    } else {
      searchTask = JSON.parse(searchTask);
    }
    if (searchResultReroute.includes(searchTask)) {
      searchTask = 'search-result';
    } else if (!validTasks.includes(searchTask)) {
      searchTask = defaultTask;
    }
    this.taskChange(searchTask);
  }

  saveFilter() {
    localStorage.setItem(`${appPrefix}-searchFilter`,
      JSON.stringify(this.searchFilter));
  }

  saveHistory() {
    localStorage.setItem(`${appPrefix}-searchHistory`,
      JSON.stringify(this.searchHistory));
  }

  saveStrongMode() {
    localStorage.setItem(`${appPrefix}-searchStrongMode`,
      JSON.stringify(this.strongMode));
  }

  saveQuery() {
    localStorage.setItem(`${appPrefix}-searchQuery`,
      JSON.stringify(this.searchQuery));
  }

  saveTask() {
    localStorage.setItem(`${appPrefix}-searchTask`,
      JSON.stringify(this.searchTask));
  }

  subscribe() {
    queue.subscribe('search.filter.change', (filter) => {
      this.filterChange(filter);
    });

    queue.subscribe('search.history.clear', () => {
      this.historyClear();
    });
    queue.subscribe('search.history.delete', (query) => {
      this.historyDelete(query);
    });
    queue.subscribe('search.history.down', (query) => {
      this.historyDown(query);
    });
    queue.subscribe('search.history.up', (query) => {
      this.historyUp(query);
    });

    queue.subscribe('search.query.change', async (query) => {
      await this.queryChange(query);
    });

    queue.subscribe('search.restore', async () => {
      await this.restore();
    });
    queue.subscribe('search.strong-mode.toggle', () => {
      this.modeToogle();
    });
    queue.subscribe('search.task.change', (searchTask) => {
      this.taskChange(searchTask);
    });
  }

  taskChange(searchTask) {
    this.searchTask = searchTask;
    this.saveTask();
    queue.publish('search.task.update', this.searchTask);
  }

  tomeFilter() {
    return {
      bookIdx: -1,
      chapterIdx: -1
    };
  }

  updateHistory() {
    this.saveHistory();
    queue.publish('search.history.update', this.searchHistory);
  }

  async updateSearchVerses() {
    this.searchVerseObjs = await tomeDb.verses.bulkGet(
      this.rig.tomeBin[tomeBinVerses]);
    queue.publish('search.verses.update', this.searchVerseObjs);
  }

}

export { SearchModel };
