'use strict';

import { queue } from '../CommandQueue.js';

const SIDEBAR_WIDTH = 320;

const mqlOnePane = window.matchMedia('screen and (max-width: 639px)');
const mqlTwoPanes = window.matchMedia('screen and (min-width: 640px) and (max-width: 959px)');
const mqlThreePanes = window.matchMedia('screen and (min-width: 960px)');

class ReadController {

  constructor() {
    this.initialize();
  }

  bookmarkAdd(verseIdx) {
    queue.publish('bookmark.add', verseIdx);
  }

  bookmarkDelete(verseIdx) {
    queue.publish('bookmark.delete', verseIdx);
  }

  columnModeToggle() {
    queue.publish('read.column-mode.toggle', null);
  }

  columnModeUpdate(columnMode) {
    this.columnMode = columnMode;
  }

  decreasePanes() {
    if (this.panes === 1) {
      this.lastSidebar = this.sidebar;
      queue.publish('sidebar.change', 'none');
    }
    if (this.columnMode && this.panes < 3) {
      queue.publish('read.column-mode.toggle', null);
    }
  }

  increasePanes() {
    if (this.currentPanes === 1) {
      if (this.sidebar !== 'none') {
        queue.publish('read.show', null);
      } else if (this.lastSidebar === null) {
        queue.publish('sidebar.change', 'navigator');
      } else {
        queue.publish('sidebar.change', this.lastSidebar);
      }
    }
  }

  initialize() {
    this.subscribe();
    this.sidebar = null;
    this.lastSidebar = null;
    this.panes = null;
    this.currentPanes = null;
    this.PaneListeners();
  }

  initializeApp() {
    this.setPanes();
    this.currentPanes = this.panes;
    queue.publish('db.restore', null);
    queue.publish('bookmark.restore', null);
    queue.publish('navigator.restore', null);
    queue.publish('search.restore', null);
    queue.publish('strong.restore', null);
    queue.publish('setting.restore', null);
    queue.publish('help.restore', null);
    queue.publish('read.restore', null);
    queue.publish('set.name-mode-btn', null);
  }

  nameModeChange() {
    queue.publish('name-mode.change', null);
  }

  nextChapter() {
    queue.publish('chapter.next', null);
  }

  PaneListeners() {
    mqlOnePane.addEventListener('change', (event) => {
      if (event.matches) {
        this.updatePanes();
      }
    });
    mqlTwoPanes.addEventListener('change', (event) => {
      if (event.matches) {
        this.updatePanes();
      }
    });
    mqlThreePanes.addEventListener('change', (event) => {
      if (event.matches) {
        this.updatePanes();
      }
    });
  }

  prevChapter() {
    queue.publish('chapter.prev', null);
  }

  setPanes() {
    if (mqlOnePane.matches) {
      this.panes = 1;
    } else if (mqlTwoPanes.matches) {
      this.panes = 2;
    } else if (mqlThreePanes.matches) {
      this.panes = 3;
    }
    queue.publish('panes.change', this.panes);
  }

  sidebarSelect(sidebar) {
    queue.publish('sidebar.change', sidebar);
  }

  sidebarUpdate(sidebar) {
    if (sidebar !== this.sidebar) {
      if (sidebar === 'none') {
        this.lastSidebar = this.sidebar;
        queue.publish(`${this.sidebar}.hide`, null);
        this.sidebar = sidebar;
        queue.publish('read.show', null);
      } else if (this.panes === 1) {
        if (this.sidebar === 'none') {
          queue.publish('read.hide', null);
        } else {
          queue.publish(`${this.sidebar}.hide`, null);
        }
        this.sidebar = sidebar;
        queue.publish(`${this.sidebar}.show`, null);
      } else {
        if (this.sidebar && this.sidebar !== 'none') {
          queue.publish(`${this.sidebar}.hide`, null);
        }
        this.sidebar = sidebar;
        queue.publish(`${this.sidebar}.show`, null);
      }
    }
  }

  strongModeToggle() {
    queue.publish('read.strong-mode.toggle', null);
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
    queue.subscribe('read.bookmark.add', (verseIdx) => {
      this.bookmarkAdd(verseIdx);
    });
    queue.subscribe('read.bookmark.delete', (verseIdx) => {
      this.bookmarkDelete(verseIdx);
    });

    queue.subscribe('read.column-mode.click', () => {
      this.columnModeToggle();
    });
    queue.subscribe('read.column-mode.update', (columnMode) => {
      this.columnModeUpdate(columnMode);
    });

    queue.subscribe('read.name-mode.click', () => {
      this.nameModeChange();
    });

    queue.subscribe('read.next.chapter', () => {
      this.nextChapter();
    });

    queue.subscribe('read.prev.chapter', () => {
      this.prevChapter();
    });

    queue.subscribe('read.strong-mode.click', () => {
      this.strongModeToggle();
    });

    queue.subscribe('read.strong.select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });

    queue.subscribe('sidebar.select', (sidebar) => {
      this.sidebarSelect(sidebar);
    });
    queue.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });

    queue.subscribe('strong.verse.update', () => {
      this.strongVerseUpdate();
    });

  }

  updatePanes() {
    this.setPanes();
    if (this.currentPanes !== this.panes) {
      if (this.currentPanes > this.panes) {
        this.decreasePanes();
      } else {
        this.increasePanes();
      }
      this.currentPanes = this.panes;
    }
  }

}

export { ReadController };
