'use strict';

import { queue } from '../CommandQueue.js';
import { chapterIdxByVerseIdx } from '../data/tomeDb.js';

class StrongController {

  constructor() {
    this.initialize();
  }

  back() {
    queue.publish('sidebar.change', 'none');
  }

  chapterIdxUpdate() {
    if (this.selectVerseIdx) {
      if (this.panes === 1 && this.sidebar !== 'none') {
        queue.publish('sidebar.select', 'none');
      }
      queue.publish('read.scroll-to-verse', this.selectVerseIdx);
      this.selectVerseIdx = null;
    }
  }

  def() {
    queue.publish('strong.task.change', 'strong-def');
  }

  defSelect(strongDef) {
    queue.publish('strong.def.sub-change', strongDef);
  }

  defChange() {
    this.defChangePending = true;
  }

  defUpdate() {
    if (this.defChangePending) {
      this.defChangePending = false;
      queue.publish('strong.task.change', 'strong-def');
    }
  }

  filter() {
    queue.publish('strong.task.change', 'strong-filter');
  }

  filterSelect(strongFilter) {
    this.filterSelectPending = true;
    queue.publish('strong.filter.change', strongFilter);
  }

  filterUpdate() {
    if (this.filterSelectPending) {
      this.filterSelectPending = false;
      queue.publish('strong.task.change', 'strong-result');
    }
  }

  hide() {
    queue.publish(`${this.strongTask}.hide`, null);
  }

  history() {
    queue.publish('strong.task.change', 'strong-history');
  }

  historyClear() {
    queue.publish('strong.history.clear', null);
  }

  historyDelete(strongDef) {
    queue.publish('strong.history.delete', strongDef);
  }

  historyDown(strongDef) {
    queue.publish('strong.history.down', strongDef);
  }

  historySelect(strongDef) {
    queue.publish('strong.def.change', strongDef);
  }

  historyUp(strongDef) {
    queue.publish('strong.history.up', strongDef);
  }

  initialize() {
    this.subscribe();
  }

  lookup() {
    queue.publish('strong.task.change', 'strong-lookup');
  }

  lookupFind(strongNum) {
    queue.publish('strong.def.change', strongNum);
  }

  modeToggle() {
    queue.publish('strong.strong-mode.toggle', null);
  }

  nextStrong() {
    queue.publish('strong.next', null);
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  prevStrong() {
    queue.publish('strong.prev', null);
  }

  readSelect(verseIdx) {
    this.selectVerseIdx = verseIdx;
    let chapterIdx = chapterIdxByVerseIdx(verseIdx);
    queue.publish('chapterIdx.change', chapterIdx);
  }

  show() {
    queue.publish(`${this.strongTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  search() {
    queue.publish('strong.task.change', 'strong-result');
  }

  strongSelect(verseIdx) {
    queue.publish('strong.verse.change', verseIdx);
  }

  subscribe() {
    queue.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    queue.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    queue.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });

    queue.subscribe('strong-def', () => {
      this.def();
    });
    queue.subscribe('strong-def.next.strong',
      () => { this.nextStrong(); }
    );
    queue.subscribe('strong-def.prev.strong',
      () => { this.prevStrong(); }
    );
    queue.subscribe('strong-def.select', (strongDef) => {
      this.defSelect(strongDef);
    });
    queue.subscribe('strong-def.word.select', (strongWord) => {
      this.wordSelect(strongWord);
    });

    queue.subscribe('strong-filter', () => {
      this.filter();
    });
    queue.subscribe('strong-filter.select', (strongFilter) => {
      this.filterSelect(strongFilter);
    });

    queue.subscribe('strong-history', () => {
      this.history();
    });
    queue.subscribe('strong-history.clear', () => {
      this.historyClear();
    });
    queue.subscribe('strong-history.delete', (strongDef) => {
      this.historyDelete(strongDef);
    });
    queue.subscribe('strong-history.down', (strongDef) => {
      this.historyDown(strongDef);
    });
    queue.subscribe('strong-history.select', (strongDef) => {
      this.historySelect(strongDef);
    });
    queue.subscribe('strong-history.up', (strongDef) => {
      this.historyUp(strongDef);
    });

    queue.subscribe('strong-lookup', () => {
      this.lookup();
    });
    queue.subscribe('strong-lookup.find', (strongNum) => {
      this.lookupFind(strongNum);
    });

    queue.subscribe('strong-result', () => {
      this.search();
    });
    queue.subscribe('strong-result.read-select', (verseIdx) => {
      this.readSelect(verseIdx);
    });
    queue.subscribe('strong-result.strong-select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });

    queue.subscribe('strong-verse', () => {
      this.verse();
    });
    queue.subscribe('strong-verse.select', (strongDef) => {
      this.verseSelect(strongDef);
    });

    queue.subscribe('strong.back', () => {
      this.back();
    });
    queue.subscribe('strong.def.change', () => {
      this.defChange();
    });
    queue.subscribe('strong.def.update', () => {
      this.defUpdate();
    });
    queue.subscribe('strong.filter.update', () => {
      this.filterUpdate();
    });
    queue.subscribe('strong.hide', () => {
      this.hide();
    });
    queue.subscribe('strong.show', () => {
      this.show();
    });
    queue.subscribe('strong.strong-mode.click', () => {
      this.modeToggle();
    });
    queue.subscribe('strong.task.update', (strongTask) => {
      this.taskUpdate(strongTask);
    });
    queue.subscribe('strong.verse.change', () => {
      this.verseChange();
    });
    queue.subscribe('strong.verse.update', () => {
      this.verseUpdate();
    });
    queue.subscribe('strong.word.update', () => {
      this.wordUpdate();
    });
  }

  taskUpdate(strongTask) {
    if (this.sidebar === 'strong') {
      if (this.strongTask !== strongTask) {
        queue.publish(`${this.strongTask}.hide`, null);
        this.strongTask = strongTask;
        queue.publish(`${this.strongTask}.show`, null);
      }
    } else {
      this.strongTask = strongTask;
    }
  }

  verse() {
    queue.publish('strong.task.change', 'strong-verse');
  }

  verseChange() {
    this.verseChangePending = true;
  }

  verseSelect(strongDef) {
    queue.publish('strong.def.change', strongDef);
  }

  verseUpdate() {
    if (this.verseChangePending) {
      this.verseChangePending = false;
      queue.publish('strong.task.change', 'strong-verse');
    }
  }

  wordSelect(strongWord) {
    this.wordSelectPending = true;
    queue.publish('strong.word.change', strongWord);
  }

  wordUpdate() {
    if (this.wordSelectPending) {
      this.wordSelectPending = false;
      queue.publish('strong.task.change', 'strong-result');
    }
  }

}

export { StrongController };
