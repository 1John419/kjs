'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  idxChapter,
  idxFirstChapter,
  idxLastChapter
} from '../tomeIdx.js';

import { getChapterName } from '../util.js';

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
      bus.publish('book.change', bookIdx);
    }
    this.lastBookIdx = bookIdx;
    let book = tome.books[bookIdx];
    let chapterCount = book[idxLastChapter] - book[idxFirstChapter] + 1;
    if (this.panes > 1 || chapterCount === 1) {
      let chapter = this.buildFirstChapter(bookIdx);
      bus.publish('chapterPkg.change', chapter);
    }
    if (this.panes === 1 && chapterCount === 1) {
      bus.publish('sidebar.change', 'none');
    } else {
      bus.publish('navigator.task.change', 'navigator-chapter');
    }
  }

  buildFirstChapter(bookIdx) {
    let firstChapterIdx = tome.books[bookIdx][idxFirstChapter];
    let chapterIdx = tome.chapters[firstChapterIdx][idxChapter];
    let chapterName = getChapterName(chapterIdx);
    let chapter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx,
      chapterName: chapterName
    };
    return chapter;
  }

  chapter() {
    bus.publish('navigator.task.change', 'navigator-chapter');
  }

  chapterSelect(chapterPkg) {
    bus.publish('chapterPkg.change', chapterPkg);
    if (this.panes === 1) {
      bus.publish('sidebar.select', 'none');
    }
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
    bus.subscribe('navigator-book', () => {
      this.book();
    });
    bus.subscribe('navigator-book.select', (bookIdx) => {
      this.bookSelect(bookIdx);
    });

    bus.subscribe('navigator-chapter', () => {
      this.chapter();
    });
    bus.subscribe('navigator-chapter.select', (chapterPkg) => {
      this.chapterSelect(chapterPkg);
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
