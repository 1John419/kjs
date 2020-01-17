'use strict';

import { bus } from '../EventBus.js';
import { chapterIdxByVerseIdx } from '../util.js';

class SearchController {

  constructor() {
    this.initialize();
  }

  back() {
    bus.publish('sidebar.change', 'none');
  }

  chapterIdxUpdate() {
    if (this.selectVerseIdx) {
      if (this.panes === 1) {
        bus.publish('sidebar.select', 'none');
      }
      bus.publish('read.scroll-to-verse', this.selectVerseIdx);
      this.selectVerseIdx = null;
    }
  }

  filter() {
    bus.publish('search.task.change', 'search-filter');
  }

  filterSelect(searchFilter) {
    bus.publish('search.filter.change', searchFilter);
    bus.publish('search.task.change', 'search-result');
  }

  hide() {
    bus.publish(`${this.searchTask}.hide`, null);
  }

  history() {
    bus.publish('search.task.change', 'search-history');
  }

  historyClear() {
    bus.publish('search.history.clear', null);
  }

  historyDelete(query) {
    bus.publish('search.history.delete', query);
  }

  historyDown(query) {
    bus.publish('search.history.down', query);
  }

  historySelect(query) {
    this.query = query;
    bus.publish('search.query.change', this.query);
    bus.publish('search.task.change', 'search-result');
  }

  historyUp(query) {
    bus.publish('search.history.up', query);
  }

  initialize() {
    this.subscribe();
  }

  lookup() {
    bus.publish('search.task.change', 'search-lookup');
  }

  lookupCancel() {
    bus.publish('search.task.change', 'search-result');
  }

  lookupSearch(query) {
    bus.publish('search.query.change', query);
  }

  modeToggle() {
    bus.publish('search.strong-mode.toggle', null);
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  queryUpdate(query) {
    this.query = query;
    bus.publish('search.task.change', 'search-result');
  }

  readSelect(verseIdx) {
    this.selectVerseIdx = verseIdx;
    let chapterIdx = chapterIdxByVerseIdx(verseIdx);
    bus.publish('chapterIdx.change', chapterIdx);
  }

  result() {
    bus.publish('search.task.change', 'search-result');
  }

  show() {
    bus.publish(`${this.searchTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  strongSelect(verseIdx) {
    bus.publish('strong.verse.change', verseIdx);
    bus.publish('strong.task.change', 'strong-verse');
    bus.publish('sidebar.change', 'strong');
  }

  subscribe() {
    bus.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('search-filter', () => {
      this.filter();
    });
    bus.subscribe('search-filter.select', (searchFilter) => {
      this.filterSelect(searchFilter);
    });

    bus.subscribe('search-history', () => {
      this.history();
    });
    bus.subscribe('search-history.clear', () => {
      this.historyClear();
    });
    bus.subscribe('search-history.delete', (query) => {
      this.historyDelete(query);
    });
    bus.subscribe('search-history.down', (query) => {
      this.historyDown(query);
    });
    bus.subscribe('search-history.select', (query) => {
      this.historySelect(query);
    });
    bus.subscribe('search-history.up', (query) => {
      this.historyUp(query);
    });

    bus.subscribe('search-lookup', () => {
      this.lookup();
    });
    bus.subscribe('search-lookup.cancel', () => {
      this.lookupCancel();
    });
    bus.subscribe('search-lookup.search', (query) => {
      this.lookupSearch(query);
    });

    bus.subscribe('search-result', () => {
      this.result();
    });
    bus.subscribe('search-result.read-select', (verseIdx) => {
      this.readSelect(verseIdx);
    });
    bus.subscribe('search-result.strong-select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });

    bus.subscribe('search.back', () => {
      this.back();
    });
    bus.subscribe('search.hide', () => {
      this.hide();
    });
    bus.subscribe('search.query.update', (query) => {
      this.queryUpdate(query);
    });
    bus.subscribe('search.show', () => {
      this.show();
    });
    bus.subscribe('search.strong-mode.click', () => {
      this.modeToggle();
    });
    bus.subscribe('search.task.update', (searchTask) => {
      this.taskUpdate(searchTask);
    });

    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
  }

  taskUpdate(searchTask) {
    if (this.sidebar === 'search') {
      bus.publish(`${this.searchTask}.hide`, null);
      this.searchTask = searchTask;
      bus.publish(`${this.searchTask}.show`, null);
    } else {
      this.searchTask = searchTask;
    }
  }

}

export { SearchController };
