'use strict';

import queue from '../CommandQueue.js';
import { chapterIdxByVerseIdx } from '../data/tomeDb.js';

class SearchController {

  constructor() {
    this.initialize();
  }

  back() {
    queue.publish('sidebar.change', 'none');
  }

  chapterIdxUpdate() {
    if (this.selectVerseIdx) {
      if (this.panes === 1 && this.sidebar !== 'none') {
        queue.publish('sidebar.select', 'none');
      }
      queue.publish('read.scroll-to-verse', this.selectVerseIdx);
      this.selectVerseIdx = null;
    }
  }

  filterPane() {
    queue.publish('search.task.change', 'search-filter');
  }

  filterSelect(searchFilter) {
    this.filterSelectPending = true;
    queue.publish('search.filter.change', searchFilter);
  }

  filterUpdate() {
    if (this.filterSelectPending) {
      this.filterSelectPending = false;
      queue.publish('search.task.change', 'search-result');
    }
  }

  hide() {
    queue.publish(`${this.searchTask}.hide`, null);
  }

  historyClear() {
    queue.publish('search.history.clear', null);
  }

  historyDelete(query) {
    queue.publish('search.history.delete', query);
  }

  historyPane() {
    queue.publish('search.task.change', 'search-history');
  }

  historySelect(query) {
    this.historySelectPending = true;
    queue.publish('search.query.change', query);
  }

  historyUpdate() {
    if (this.historySelectPending) {
      this.historySelectPending = false;
      queue.publish('search.task.change', 'search-result');
    }
  }

  initialize() {
    this.subscribe();
  }

  lookupCancel() {
    queue.publish('search.task.change', 'search-result');
  }

  lookupPane() {
    queue.publish('search.task.change', 'search-lookup');
  }

  lookupSearch(query) {
    queue.publish('search.query.change', query);
  }

  modeToggle() {
    queue.publish('search.strong-mode.toggle', null);
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  queryChange() {
    this.queryChangePending = true;
  }

  queryUpdate() {
    if (this.queryChangePending) {
      queue.publish('search.task.change', 'search-result');
    }
  }

  readSelect(verseIdx) {
    this.selectVerseIdx = verseIdx;
    let chapterIdx = chapterIdxByVerseIdx(verseIdx);
    queue.publish('chapterIdx.change', chapterIdx);
  }

  resultPane() {
    queue.publish('search.task.change', 'search-result');
  }

  show() {
    queue.publish(`${this.searchTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  strongSelect(verseIdx) {
    this.strongSelectPending = true;
    queue.publish('strong.verse.change', verseIdx);
  }

  strongVerseUpdate() {
    if (this.strongSelectPending) {
      this.strongSelectPending = false;
      queue.publish('sidebar.change', 'strong');
    }
  }

  subscribe() {
    queue.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    queue.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    queue.subscribe('search-filter', () => {
      this.filterPane();
    });
    queue.subscribe('search-filter.select', (searchFilter) => {
      this.filterSelect(searchFilter);
    });

    queue.subscribe('search-history', () => {
      this.historyPane();
    });
    queue.subscribe('search-history.clear', () => {
      this.historyClear();
    });
    queue.subscribe('search-history.delete', (query) => {
      this.historyDelete(query);
    });
    queue.subscribe('search-history.select', (query) => {
      this.historySelect(query);
    });

    queue.subscribe('search-lookup', () => {
      this.lookupPane();
    });
    queue.subscribe('search-lookup.cancel', () => {
      this.lookupCancel();
    });
    queue.subscribe('search-lookup.search', (query) => {
      this.lookupSearch(query);
    });

    queue.subscribe('search-result', () => {
      this.resultPane();
    });
    queue.subscribe('search-result.read-select', (verseIdx) => {
      this.readSelect(verseIdx);
    });
    queue.subscribe('search-result.strong-select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });

    queue.subscribe('search.back', () => {
      this.back();
    });
    queue.subscribe('search.filter.update', () => {
      this.filterUpdate();
    });
    queue.subscribe('search.hide', () => {
      this.hide();
    });
    queue.subscribe('search.history.update', () => {
      this.historyUpdate();
    });
    queue.subscribe('search.query.change', () => {
      this.queryChange();
    });
    queue.subscribe('search.query.update', () => {
      this.queryUpdate();
    });
    queue.subscribe('search.show', () => {
      this.show();
    });
    queue.subscribe('search.strong-mode.click', () => {
      this.modeToggle();
    });
    queue.subscribe('search.task.update', (searchTask) => {
      this.taskUpdate(searchTask);
    });

    queue.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });

    queue.subscribe('strong.verse.update', () => {
      this.strongVerseUpdate();
    });
  }

  taskUpdate(searchTask) {
    if (this.sidebar === 'search') {
      if (this.searchTask !== searchTask) {
        queue.publish(`${this.searchTask}.hide`, null);
        this.searchTask = searchTask;
        queue.publish(`${this.searchTask}.show`, null);
      }
    } else {
      this.searchTask = searchTask;
    }
  }

}

export { SearchController };
