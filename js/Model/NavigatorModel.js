'use strict';

import queue from '../CommandQueue.js';
import {
  tomeChapters,
  tomeDb
} from '../data/tomeDb.js';
import {
  chapterBookIdx,
  chapterFirstVerseIdx,
  chapterLastVerseIdx
} from '../data/tomeIdx.js';
import {
  appPrefix,
  range
} from '../util.js';

const validTasks = ['navigator-book', 'navigator-chapter'];

const CHAPTER_IDX_GENESIS_1 = 0;

class NavigatorModel {

  constructor() {
    this.initialize();
  }

  bookIdxChange(bookIdx) {
    this.bookIdx = bookIdx;
    queue.publish('bookIdx.update', this.bookIdx);
  }

  async chapterIdxChange(chapterIdx) {
    this.chapterIdx = chapterIdx;
    this.saveChapterIdx();
    await this.updateVerses();
    let bookIdx = tomeChapters[this.chapterIdx][chapterBookIdx];
    if (this.bookIdx !== bookIdx) {
      this.bookIdxChange(bookIdx);
    }
    queue.publish('chapterIdx.update', this.chapterIdx);
  }

  async chapterNext() {
    let nextChapterIdx = this.chapterIdx + 1;
    if (nextChapterIdx >= tomeChapters.length) {
      nextChapterIdx = 0;
    }
    await this.chapterIdxChange(nextChapterIdx);
  }

  async chapterPrev() {
    let prevChapterIdx = this.chapterIdx - 1;
    if (prevChapterIdx < 0) {
      prevChapterIdx = tomeChapters.length - 1;
    }
    await this.chapterIdxChange(prevChapterIdx);
  }

  initialize() {
    this.subscribe();
  }

  async restore() {
    this.restoreTask();
    await this.restoreChapterIdx();
  }

  async restoreChapterIdx() {
    let defaultIdx = CHAPTER_IDX_GENESIS_1;
    let chapterIdx = localStorage.getItem(`${appPrefix}-chapterIdx`);
    if (!chapterIdx) {
      chapterIdx = defaultIdx;
    } else {
      try {
        chapterIdx = JSON.parse(chapterIdx);
      } catch (error) {
        chapterIdx = defaultIdx;
      }
      if (!tomeChapters[chapterIdx]) {
        chapterIdx = defaultIdx;
      }
    }
    await this.chapterIdxChange(chapterIdx);
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

  saveChapterIdx() {
    localStorage.setItem(`${appPrefix}-chapterIdx`,
      JSON.stringify(this.chapterIdx));
  }

  saveNavigatorTask() {
    localStorage.setItem(`${appPrefix}-navigatorTask`,
      JSON.stringify(this.navigatorTask));
  }

  subscribe() {
    queue.subscribe('bookIdx.change', (bookIdx) => {
      this.bookIdxChange(bookIdx);
    });

    queue.subscribe('chapter.next', async () => {
      await this.chapterNext();
    });
    queue.subscribe('chapter.prev', async () => {
      await this.chapterPrev();
    });

    queue.subscribe('chapterIdx.change', async (chapterIdx) => {
      await this.chapterIdxChange(chapterIdx);
    });

    queue.subscribe('navigator.restore', async () => {
      await this.restore();
    });
    queue.subscribe('navigator.task.change', (navigatorTask) => {
      this.taskChange(navigatorTask);
    });
  }

  taskChange(navigatorTask) {
    this.navigatorTask = navigatorTask;
    this.saveNavigatorTask();
    queue.publish('navigator.task.update', this.navigatorTask);
  }

  async updateVerses() {
    let chapter = tomeChapters[this.chapterIdx];
    let keys = range(chapter[chapterFirstVerseIdx],
      chapter[chapterLastVerseIdx] + 1);
    this.verseObjs = await tomeDb.verses.bulkGet(keys);
    queue.publish('navigator.verses.update', this.verseObjs);
  }

}

export { NavigatorModel };
