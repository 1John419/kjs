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

  columnSelect(column) {
    this.column = column;
    bus.publish('column.change', column);
  }

  columnUpdate(column) {
    this.column = column;
  }

  decreasePanes() {
    if (this.panes === 1) {
      this.lastSidebar = this.sidebar;
      bus.publish('sidebar.change', 'none');
      bus.publish('read.column.select', 1);
    } else if (this.panes === 2) {
      bus.publish('read.column.select', 1);
    } else if (this.panes === 3 && this.column > 1) {
      bus.publish('read.column.select', 2);
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

  modeToggle() {
    bus.publish('read.strong-mode.toggle', null);
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

  strongSelect(verseIdx) {
    bus.publish('strong.verse.change', verseIdx);
    bus.publish('strong.task.change', 'strong-verse');
    if (this.sidebar !== 'strong') {
      bus.publish('sidebar.change', 'strong');
    }
  }

  subscribe() {
    bus.subscribe('column.update', (column) => {
      this.columnUpdate(column);
    });

    bus.subscribe('read.bookmark.add',
      (verseIdx) => { this.bookmarkAdd(verseIdx); }
    );
    bus.subscribe('read.bookmark.delete',
      (verseIdx) => { this.bookmarkDelete(verseIdx); }
    );

    bus.subscribe('read.column.select',
      (column) => { this.columnSelect(column); }
    );
    bus.subscribe('read.next.chapter',
      () => { this.nextChapter(); }
    );
    bus.subscribe('read.prev.chapter',
      () => { this.prevChapter(); }
    );
    bus.subscribe('read.strong-mode.click', () => {
      this.modeToggle();
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
