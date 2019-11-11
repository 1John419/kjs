'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import { idxBook } from '../tomeIdx.js';

import { appPrefix } from '../util.js';

import { getChapterName } from '../util.js';

const validTasks = ['navigator-book', 'navigator-chapter'];

class NavigatorModel {

  constructor() {
    this.initialize();
  }

  buildChapterPkg(chapterIdx) {
    let chapter = tome.chapters[chapterIdx];
    return {
      bookIdx: chapter[idxBook],
      chapterIdx: chapterIdx,
      chapterName: getChapterName(chapterIdx)
    };
  }

  chapterPkgChange(chapterPkg) {
    this.chapterPkg = chapterPkg;
    this.saveChapterPkg();
    bus.publish('book.change', this.chapterPkg.bookIdx);
    bus.publish('chapterPkg.update', this.chapterPkg);
  }

  chapterPkgIsValid(chapterPkg) {
    let chapterIdx;
    let chapter;
    let result = true;
    try {
      chapterIdx = chapterPkg.chapterIdx;
      chapter = tome.chapters[chapterIdx];
    } catch (error) {
      result = false;
    }
    if (result) {
      if (
        chapterPkg.bookIdx !== chapter[idxBook] ||
        chapterPkg.chapterIdx !== chapterIdx ||
        chapterPkg.chapterName !== getChapterName(chapterIdx)
      ) {
        result = false;
      }
    }
    return result;
  }

  chapterNext() {
    let nextChapterIdx = this.chapterPkg.chapterIdx + 1;
    if (nextChapterIdx >= tome.chapters.length) {
      nextChapterIdx = 0;
    }
    this.chapterPkgChange(this.buildChapterPkg(nextChapterIdx));
  }

  chapterPrev() {
    let prevChapterIdx = this.chapterPkg.chapterIdx - 1;
    if (prevChapterIdx < 0) {
      prevChapterIdx = tome.chapters.length - 1;
    }
    this.chapterPkgChange(this.buildChapterPkg(prevChapterIdx));
  }

  initialize() {
    this.subscribe();
  }

  restore() {
    this.restoreTask();
    this.restoreChapterPkg();
  }

  restoreChapterPkg() {
    let defaultPkg = this.buildChapterPkg(0);
    let chapterPkg = localStorage.getItem(`${appPrefix}-chapterPkg`);
    if (!chapterPkg) {
      chapterPkg = defaultPkg;
    } else {
      try {
        chapterPkg = JSON.parse(chapterPkg);
      } catch (error) {
        chapterPkg = defaultPkg;
      }
      if (!this.chapterPkgIsValid(chapterPkg)) {
        chapterPkg = defaultPkg;
      }
    }
    this.chapterPkgChange(chapterPkg);
  }

  restoreTask() {
    let defaultTask = 'navigator-book';
    let navigatorTask = localStorage.getItem(`${appPrefix}-navigatorTask`);
    if (!navigatorTask) {
      navigatorTask = defaultTask;
    } else {
      try {
        navigatorTask = JSON.parse(navigatorTask);
      } catch (error) {
        navigatorTask = defaultTask;
      }
    }
    if (!validTasks.includes(navigatorTask)) {
      navigatorTask = defaultTask;
    }
    this.taskChange(navigatorTask);
  }

  saveChapterPkg() {
    localStorage.setItem(`${appPrefix}-chapterPkg`,
      JSON.stringify(this.chapterPkg));
  }

  saveNavigatorTask() {
    localStorage.setItem(`${appPrefix}-navigatorTask`,
      JSON.stringify(this.navigatorTask));
  }

  subscribe() {
    bus.subscribe('chapter.next', () => {
      this.chapterNext();
    });
    bus.subscribe('chapter.prev', () => {
      this.chapterPrev();
    });

    bus.subscribe('chapterPkg.change', (chapter) => {
      this.chapterPkgChange(chapter);
    });

    bus.subscribe('navigator.restore', () => {
      this.restore();
    });
    bus.subscribe('navigator.task.change', (navigatorTask) => {
      this.taskChange(navigatorTask);
    });
  }

  taskChange(navigatorTask) {
    this.navigatorTask = navigatorTask;
    this.saveNavigatorTask();
    bus.publish('navigator.task.update', this.navigatorTask);
  }

}

export { NavigatorModel };
