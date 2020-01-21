'use strict';

import { bus } from '../EventBus.js';
import { tomeBooks } from '../data/tomeDb.js';
import {
  bookFirstChapterIdx,
  bookLastChapterIdx
} from '../data/tomeIdx.js';

class NavigatorController {

  constructor() {
    this.initialize();
  }

  back() {
    bus.publish('sidebar.change', 'none');
  }

  book() {
    bus.publish('navigator.task.change', 'navigator-book');
  }

  bookSelect(bookIdx) {
    if (bookIdx !== this.lastBookIdx) {
      bus.publish('bookIdx.change', bookIdx);
    }
    this.lastBookIdx = bookIdx;
    let book = tomeBooks[bookIdx];
    let chapterCount =
      book[bookLastChapterIdx] - book[bookFirstChapterIdx] + 1;
    if (this.panes > 1 || chapterCount === 1) {
      let chapterIdx = tomeBooks[bookIdx][bookFirstChapterIdx];
      bus.publish('chapterIdx.change', chapterIdx);
    }
    if (this.panes === 1 && chapterCount === 1) {
      bus.publish('sidebar.change', 'none');
    } else {
      bus.publish('navigator.task.change', 'navigator-chapter');
    }
  }

  chapter() {
    bus.publish('navigator.task.change', 'navigator-chapter');
  }

  chapterIdxUpdate() {
    if (this.panes === 1 && this.sidebar === 'navigator') {
      bus.publish('sidebar.select', 'none');
    }
    bus.publish('read.scroll-to-top');
  }

  chapterSelect(chapterIdx) {
    bus.publish('chapterIdx.change', chapterIdx);
  }

  hide() {
    bus.publish(`${this.navigatorTask}.hide`, null);
  }

  initialize() {
    this.subscribe();
    this.lastBookIdx = null;
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  show() {
    bus.publish(`${this.navigatorTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  subscribe() {
    bus.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    bus.subscribe('navigator-book', () => {
      this.book();
    });
    bus.subscribe('navigator-book.select', (bookIdx) => {
      this.bookSelect(bookIdx);
    });

    bus.subscribe('navigator-chapter', () => {
      this.chapter();
    });
    bus.subscribe('navigator-chapter.select', (chapterIdx) => {
      this.chapterSelect(chapterIdx);
    });

    bus.subscribe('navigator.back', () => {
      this.back();
    });
    bus.subscribe('navigator.hide', () => {
      this.hide();
    });
    bus.subscribe('navigator.show', () => {
      this.show();
    });
    bus.subscribe('navigator.task.update', (navigatorTask) => {
      this.taskUpdate(navigatorTask);
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
  }

  taskUpdate(navigatorTask) {
    if (this.sidebar === 'navigator') {
      bus.publish(`${this.navigatorTask}.hide`, null);
      this.navigatorTask = navigatorTask;
      bus.publish(`${this.navigatorTask}.show`, null);
    } else {
      this.navigatorTask = navigatorTask;
    }
  }

}

export { NavigatorController };
