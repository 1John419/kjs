'use strict';

import { queue } from '../CommandQueue.js';
import { util } from '../util.js';
import { kjvIdx} from '../data/kjvIdx.js';
import { kjvLists} from '../data/kjvLists.js';
import { kjvDb } from '../Model/DbModel.js';

class ReadModel {

  constructor() {
    this.initialize();
  }

  chapterIdxUpdate(chapterIdx) {
    this.chapterIdx = chapterIdx;
    this.updateReadVerseObjs();
  }

  columnModeChange(columnMode) {
    this.columnMode = columnMode;
    this.saveColumnMode();
    queue.publish('read.column-mode.update', this.columnMode);
  }

  columnModeToogle() {
    this.columnModeChange(!this.columnMode);
  }

  initialize() {
    this.subscribe();
  }

  nameModeChange(nameMode) {
    this.updateReadVerseObjs();
  }

  panesChange(panes) {
    this.panes = panes;
    queue.publish('panes.update', this.panes);
  }

  restore() {
    this.restoreColumnMode();
    this.restoreStrongMode();
    this.restoreSidebar();
  }

  restoreColumnMode() {
    const defaultColumnMode = false;
    let columnMode = localStorage.getItem('columnMode');
    if (!columnMode) {
      columnMode = defaultColumnMode;
    } else {
      try {
        columnMode = JSON.parse(columnMode);
      } catch (error) {
        columnMode = defaultColumnMode;
      }
      if (typeof columnMode !== 'boolean') {
        columnMode = defaultColumnMode;
      }
    }
    this.columnModeChange(columnMode);
  }

  restoreSidebar() {
    const defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
    let sidebar = localStorage.getItem('sidebar');
    if (!sidebar) {
      sidebar = defaultSidebar;
    } else {
      try {
        sidebar = JSON.parse(sidebar);
      } catch (error) {
        sidebar = defaultSidebar;
      }
    }
    if (this.panes > 1) {
      sidebar = sidebar === 'none' ? 'navigator' : sidebar;
    } else if (sidebar !== 'none') {
      sidebar = 'none';
    }
    this.sidebarChange(sidebar);
  }

  restoreStrongMode() {
    const defaultStrongMode = false;
    let strongMode = localStorage.getItem('readStrongMode');
    if (!strongMode) {
      strongMode = defaultStrongMode;
    } else {
      try {
        strongMode = JSON.parse(strongMode);
      } catch (error) {
        strongMode = defaultStrongMode;
      }
      if (typeof strongMode !== 'boolean') {
        strongMode = defaultStrongMode;
      }
    }
    this.strongModeChange(strongMode);
  }

  saveColumnMode() {
    localStorage.setItem('columnMode',
      JSON.stringify(this.columnMode));
  }

  saveStrongMode() {
    localStorage.setItem('readStrongMode',
      JSON.stringify(this.strongMode));
  }

  saveSidebar() {
    localStorage.setItem('sidebar', JSON.stringify(this.sidebar));
  }

  sidebarChange(sidebar) {
    this.sidebar = sidebar;
    this.saveSidebar();
    queue.publish('sidebar.update', this.sidebar);
  }

  strongModeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveStrongMode();
    queue.publish('read.strong-mode.update', this.strongMode);
  }

  strongModeToogle() {
    this.strongModeChange(!this.strongMode);
  }

  subscribe() {
    queue.subscribe('chapterIdx.update', (chapterIdx) => {
      this.chapterIdxUpdate(chapterIdx);
    });

    queue.subscribe('panes.change', (panes) => {
      this.panesChange(panes);
    });

    queue.subscribe('read.column-mode.toggle', () => {
      this.columnModeToogle();
    });
    queue.subscribe('name-mode.change', () => {
      this.nameModeChange();
    });
    queue.subscribe('read.restore',
      () => { this.restore(); }
    );
    queue.subscribe('read.strong-mode.toggle', () => {
      this.strongModeToogle();
    });

    queue.subscribe('sidebar.change', (sidebar) => {
      this.sidebarChange(sidebar);
    });
  }

  async updateReadVerseObjs() {
    const chapter = kjvLists.chapters[this.chapterIdx];
    const keys = util.range(chapter[kjvIdx.chapter.firstVerseIdx],
      chapter[kjvIdx.chapter.lastVerseIdx] + 1);
    this.verseObjs = await kjvDb.verses.bulkGet(keys);
    queue.publish('read.verse-objs.update', this.verseObjs);
  }
}

export { ReadModel };
