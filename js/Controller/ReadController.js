'use strict';

import { queue } from '../CommandQueue.js';

const SIDEBAR_WIDTH = 320;

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
  }

  initializeApp() {
    this.setPanes();
    this.currentPanes = this.panes;
    queue.publish('bookmark.restore', null);
    queue.publish('navigator.restore', null);
    queue.publish('search.restore', null);
    queue.publish('strong.restore', null);
    queue.publish('setting.restore', null);
    queue.publish('help.restore', null);
    queue.publish('read.restore', null);
    queue.publish('sidebar.restore', null);
  }

  nextChapter() {
    queue.publish('chapter.next', null);
  }

  prevChapter() {
    queue.publish('chapter.prev', null);
  }

  setPanes() {
    this.panes = Math.min(Math.floor(window.innerWidth / SIDEBAR_WIDTH), 4);
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
        queue.publish('read.show', null);
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

    queue.subscribe('window.resize', () => {
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
