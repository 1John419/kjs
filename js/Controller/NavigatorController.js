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

  book() {
    queue.publish('navigator.task.change', 'navigator-book');
  }

  bookSelect(bookIdx) {
    if (bookIdx !== this.lastBookIdx) {
      queue.publish('bookIdx.change', bookIdx);
    }
    this.lastBookIdx = bookIdx;
    let book = tomeBooks[bookIdx];
    let chapterCount =
      book[bookLastChapterIdx] - book[bookFirstChapterIdx] + 1;
    if (this.panes > 1 || chapterCount === 1) {
      let chapterIdx = tomeBooks[bookIdx][bookFirstChapterIdx];
      queue.publish('chapterIdx.change', chapterIdx);
    }
    if (this.panes === 1 && chapterCount === 1) {
      queue.publish('sidebar.change', 'none');
    } else {
      queue.publish('navigator.task.change', 'navigator-chapter');
    }
  }

  chapter() {
    queue.publish('navigator.task.change', 'navigator-chapter');
  }

  chapterIdxUpdate() {
    if (this.panes === 1 && this.sidebar === 'navigator') {
      queue.publish('sidebar.select', 'none');
    }
    queue.publish('read.scroll-to-top');
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
    queue.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    queue.subscribe('navigator-book', () => {
      this.book();
    });
    queue.subscribe('navigator-book.select', (bookIdx) => {
      this.bookSelect(bookIdx);
    });

    queue.subscribe('navigator-chapter', () => {
      this.chapter();
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
