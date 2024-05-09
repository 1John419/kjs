'use strict';

import { queue } from '../CommandQueue.js';
import { SearchEngine } from '../SearchEngine.js';
import { binIdx } from '../data/binIdx.js';
import { kjvDb } from '../Model/DbModel.js';

const searchResultReroute = [
  'search-filter', 'search-history',
];
const validTasks = [
  'search-result', 'search-lookup', 'search-filter', 'search-history',
];

const DEFAULT_QUERY = 'day of the lord';

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
    const index = this.searchHistory.indexOf(str);
    this.searchHistory.splice(index, 1);
    this.updateHistory();
  }

  historyIsValid(searchHistory) {
    return searchHistory.some((x) => {
      return typeof x === 'string';
    });
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
    const rig = await this.engine.performSearch(searchQuery);
    if (rig.state === 'ERROR') {
      let message;
      if (rig.type === 'EMPTY') {
        message = 'Enter a search expression.';
      } else if (rig.type === 'INVALID') {
        message = 'Invalid query expression.';
      } else if (rig.wordStatus !== 'OK') {
        message = rig.wordStatus;
      }
      this.searchQuery = '';
      this.rig = null;
      queue.publish('search.query.error', message);
    } else {
      this.rig = rig;
      this.searchQuery = searchQuery;
      this.saveQuery();
      this.addHistory();
      await this.updateSearchVerseObjs();
      queue.publish('rig.update', this.rig);
      this.resetFilter();
      queue.publish('search.query.update', this.searchQuery);
    }
  }

  resetFilter() {
    const filter = this.kjvFilter();
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
    const defaultFilter = this.kjvFilter();
    let searchFilter = localStorage.getItem('searchFilter');
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
    const defaultHistory = [];
    let searchHistory = localStorage.getItem('searchHistory');
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
    const defaultMode = false;
    let strongMode = localStorage.getItem('searchStrongMode');
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
    const defaultQuery = DEFAULT_QUERY;
    let searchQuery = localStorage.getItem('searchQuery');
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
    const defaultTask = 'search-result';
    let searchTask = localStorage.getItem('searchTask');
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
    localStorage.setItem('searchFilter',
      JSON.stringify(this.searchFilter));
  }

  saveHistory() {
    localStorage.setItem('searchHistory',
      JSON.stringify(this.searchHistory));
  }

  saveStrongMode() {
    localStorage.setItem('searchStrongMode',
      JSON.stringify(this.strongMode));
  }

  saveQuery() {
    localStorage.setItem('searchQuery',
      JSON.stringify(this.searchQuery));
  }

  saveTask() {
    localStorage.setItem('searchTask',
      JSON.stringify(this.searchTask));
  }

  subscribe() {
    queue.subscribe('name-mode.update', () => {
      this.queryChange(this.searchQuery);
    });

    queue.subscribe('search.filter.change', (filter) => {
      this.filterChange(filter);
    });

    queue.subscribe('search.history.clear', () => {
      this.historyClear();
    });
    queue.subscribe('search.history.delete', (query) => {
      this.historyDelete(query);
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

  kjvFilter() {
    return {
      bookIdx: -1,
      chapterIdx: -1,
    };
  }

  updateHistory() {
    this.saveHistory();
    queue.publish('search.history.update', this.searchHistory);
  }

  async updateSearchVerseObjs() {
    if (this.rig === null) {
      return;
    }
    this.searchVerseObjs = await kjvDb.verses.bulkGet(this.rig.kjvBin[binIdx.kjvBinIdx.verses]);
    queue.publish('search.verse-objs.update', this.searchVerseObjs);
  }

}

export { SearchModel };
