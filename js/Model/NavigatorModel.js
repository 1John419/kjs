'use strict';

import { queue } from '../CommandQueue.js';
import { kjvIdx } from '../data/kjvIdx.js';
import { firstVerseIdxByChapterIdx, kjvLists } from '../data/kjvLists.js';

const validTasks = [
  'navigator-book', 'navigator-chapter',
];

const CHAPTER_IDX_GENESIS_1 = 0;

class NavigatorModel {

  constructor() {
    this.initialize();
  }

  bookIdxChange(bookIdx) {
    this.bookIdx = bookIdx;
    queue.publish('bookIdx.update', this.bookIdx);
  }

  chapterIdxChange(chapterIdx) {
    this.chapterIdx = chapterIdx;
    this.saveChapterIdx();
    const bookIdx = kjvLists.chapters[this.chapterIdx][kjvIdx.chapter.bookIdx];
    if (this.bookIdx !== bookIdx) {
      this.bookIdxChange(bookIdx);
    }
    queue.publish('chapterIdx.update', this.chapterIdx);
    const verseIdx = firstVerseIdxByChapterIdx(this.chapterIdx);
    queue.publish('read.scroll-verse-idx', verseIdx);
  }

  async chapterNext() {
    let nextChapterIdx = this.chapterIdx + 1;
    if (nextChapterIdx >= kjvLists.chapters.length) {
      nextChapterIdx = 0;
    }
    await this.chapterIdxChange(nextChapterIdx);
  }

  async chapterPrev() {
    let prevChapterIdx = this.chapterIdx - 1;
    if (prevChapterIdx < 0) {
      prevChapterIdx = kjvLists.chapters.length - 1;
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
    const defaultIdx = CHAPTER_IDX_GENESIS_1;
    let chapterIdx = localStorage.getItem('chapterIdx');
    if (!chapterIdx) {
      chapterIdx = defaultIdx;
    } else {
      try {
        chapterIdx = JSON.parse(chapterIdx);
      } catch (error) {
        chapterIdx = defaultIdx;
      }
      if (!kjvLists.chapters[chapterIdx]) {
        chapterIdx = defaultIdx;
      }
    }
    await this.chapterIdxChange(chapterIdx);
  }

  restoreTask() {
    const defaultTask = 'navigator-book';
    let navigatorTask = localStorage.getItem('navigatorTask');
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
    localStorage.setItem('chapterIdx',
      JSON.stringify(this.chapterIdx));
  }

  saveNavigatorTask() {
    localStorage.setItem('navigatorTask',
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

}

export { NavigatorModel };
