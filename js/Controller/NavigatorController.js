'use strict';

import { queue } from '../CommandQueue.js';
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
    queue.publish('sidebar.change', 'none');
  }

  bookIdxUpdate(bookIdx) {
    this.lastBookIdx = bookIdx;
    if (this.bookSelectPending) {
      this.bookSelectPending = false;
      let book = tomeBooks[bookIdx];
      this.chapterCount = book[bookLastChapterIdx] -
        book[bookFirstChapterIdx] + 1;
      if (this.panes > 1 || this.chapterCount === 1) {
        let chapterIdx = tomeBooks[bookIdx][bookFirstChapterIdx];
        queue.publish('chapterIdx.change', chapterIdx);
      } else {
        queue.publish('navigator.task.change', 'navigator-chapter');
      }
    }
  }

  bookPane() {
    queue.publish('navigator.task.change', 'navigator-book');
  }

  bookSelect(bookIdx) {
    if (bookIdx !== this.lastBookIdx) {
      this.bookSelectPending = true;
      queue.publish('bookIdx.change', bookIdx);
    }
  }

  chapterIdxUpdate() {
    queue.publish('read.scroll-to-top');
    if (this.sidebar === 'navigator') {
      if (this.panes === 1) {
        queue.publish('sidebar.change', 'none');
      } else if (this.navigatorTask !== 'navigator-chapter') {
        queue.publish('navigator.task.change', 'navigator-chapter');
      }
    }
  }

  chapterPane() {
    queue.publish('navigator.task.change', 'navigator-chapter');
  }

  chapterSelect(chapterIdx) {
    queue.publish('chapterIdx.change', chapterIdx);
  }

  hide() {
    queue.publish(`${this.navigatorTask}.hide`, null);
  }

  initialize() {
    this.subscribe();
    this.lastBookIdx = null;
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  show() {
    queue.publish(`${this.navigatorTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  subscribe() {
    queue.subscribe('bookIdx.update', (bookIdx) => {
      this.bookIdxUpdate(bookIdx);
    });

    queue.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    queue.subscribe('navigator-book', () => {
      this.bookPane();
    });
    queue.subscribe('navigator-book.select', (bookIdx) => {
      this.bookSelect(bookIdx);
    });

    queue.subscribe('navigator-chapter', () => {
      this.chapterPane();
    });
    queue.subscribe('navigator-chapter.select', (chapterIdx) => {
      this.chapterSelect(chapterIdx);
    });

    queue.subscribe('navigator.back', () => {
      this.back();
    });
    queue.subscribe('navigator.hide', () => {
      this.hide();
    });
    queue.subscribe('navigator.show', () => {
      this.show();
    });
    queue.subscribe('navigator.task.update', (navigatorTask) => {
      this.taskUpdate(navigatorTask);
    });

    queue.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    queue.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
  }

  taskUpdate(navigatorTask) {
    if (this.sidebar === 'navigator') {
      if (this.navigatorTask !== navigatorTask) {
        queue.publish(`${this.navigatorTask}.hide`, null);
        this.navigatorTask = navigatorTask;
        queue.publish(`${this.navigatorTask}.show`, null);
      }
    } else {
      this.navigatorTask = navigatorTask;
    }
  }

}

export { NavigatorController };
