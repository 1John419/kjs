'use strict';

import { bus } from '../EventBus.js';

const SIDEBAR_WIDTH = 320;

class ReadController {

  constructor() {
    this.initialize();
  }

  bookmarkAdd(verseIdx) {
    bus.publish('bookmark.add', verseIdx);
  }

  bookmarkDelete(verseIdx) {
    bus.publish('bookmark.delete', verseIdx);
  }

  columnModeToggle() {
    bus.publish('read.column-mode.toggle', null);
  }

  columnModeUpdate(columnMode) {
    this.columnMode = columnMode;
  }

  decreasePanes() {
    if (this.panes === 1) {
      this.lastSidebar = this.sidebar;
      bus.publish('sidebar.change', 'none');
    }
    if (this.columnMode && this.panes < 3) {
      bus.publish('read.column-mode.toggle', null);
    }
  }

  increasePanes() {
    if (this.currentPanes === 1) {
      if (this.sidebar !== 'none') {
        bus.publish('read.show', null);
      } else if (this.lastSidebar === null) {
        bus.publish('sidebar.change', 'navigator');
      } else {
        bus.publish('sidebar.change', this.lastSidebar);
      }
    }
  }

  initialize() {
    this.subscribe();
    this.sidebar = null;
    this.lastSidebar = null;
  }

  initializeApp() {
    this.setPanes();
    this.currentPanes = this.panes;
    bus.publish('sidebar.restore', null);
    bus.publish('bookmark.restore', null);
    bus.publish('navigator.restore', null);
    bus.publish('search.restore', null);
    bus.publish('strong.restore', null);
    bus.publish('setting.restore', null);
    bus.publish('help.restore', null);
    bus.publish('read.restore', null);
  }

  nextChapter() {
    bus.publish('chapter.next', null);
  }

  prevChapter() {
    bus.publish('chapter.prev', null);
  }

  setPanes() {
    this.panes = Math.min(Math.floor(window.innerWidth / SIDEBAR_WIDTH), 4);
    bus.publish('panes.change', this.panes);
  }

  sidebarSelect(sidebar) {
    bus.publish('sidebar.change', sidebar);
  }

  sidebarUpdate(sidebar) {
    if (sidebar !== this.sidebar) {
      if (sidebar === 'none') {
        this.lastSidebar = this.sidebar;
        bus.publish(`${this.sidebar}.hide`, null);
        this.sidebar = sidebar;
        bus.publish('read.show', null);
      } else if (this.panes === 1) {
        if (this.sidebar === 'none') {
          bus.publish('read.hide', null);
        } else {
          bus.publish(`${this.sidebar}.hide`, null);
        }
        this.sidebar = sidebar;
        bus.publish(`${this.sidebar}.show`, null);
      } else {
        bus.publish('read.show', null);
        if (this.sidebar !== 'none') {
          bus.publish(`${this.sidebar}.hide`, null);
        }
        this.sidebar = sidebar;
        bus.publish(`${this.sidebar}.show`, null);
      }
    }
  }

  strongModeToggle() {
    bus.publish('read.strong-mode.toggle', null);
  }

  strongSelect(verseIdx) {
    bus.publish('strong.verse.change', verseIdx);
    bus.publish('strong.task.change', 'strong-verse');
    if (this.sidebar !== 'strong') {
      bus.publish('sidebar.change', 'strong');
    }
  }

  subscribe() {
    bus.subscribe('read.bookmark.add', (verseIdx) => {
      this.bookmarkAdd(verseIdx);
    });
    bus.subscribe('read.bookmark.delete', (verseIdx) => {
      this.bookmarkDelete(verseIdx);
    });

    bus.subscribe('read.column-mode.click', () => {
      this.columnModeToggle();
    });
    bus.subscribe('read.column-mode.update', (columnMode) => {
      this.columnModeUpdate(columnMode);
    });

    bus.subscribe('read.next.chapter', () => {
      this.nextChapter();
    });

    bus.subscribe('read.prev.chapter', () => {
      this.prevChapter();
    });

    bus.subscribe('read.strong-mode.click', () => {
      this.strongModeToggle();
    });

    bus.subscribe('read.strong.select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });

    bus.subscribe('sidebar.select', (sidebar) => {
      this.sidebarSelect(sidebar);
    });
    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });

    bus.subscribe('window.resize', () => {
      this.updatePanes();
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
