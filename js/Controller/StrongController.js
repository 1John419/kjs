'use strict';

import { bus } from '../EventBus.js';

import { getChapterPkg } from '../util.js';

class StrongController {

  constructor() {
    this.initialize();
  }

  back() {
    bus.publish('sidebar.change', 'none');
  }

  def() {
    bus.publish('strong.task.change', 'strong-def');
  }

  defSelect(strongDef) {
    bus.publish('strong.def.change', strongDef);
    bus.publish('strong.word.first', null);
    bus.publish('strong.filter.reset', null);
    bus.publish('strong.task.change', 'strong-def');
  }

  defUpdate(strongDef) {
    this.strongDef = strongDef;
    bus.publish('strong.word.first', null);
    bus.publish('strong.filter.reset', null);
    bus.publish('strong.task.change', 'strong-def');
  }

  filter() {
    bus.publish('strong.task.change', 'strong-filter');
  }

  filterSelect(strongFilter) {
    bus.publish('strong.filter.change', strongFilter);
    bus.publish('strong.task.change', 'strong-result');
  }

  hide() {
    bus.publish(`${this.strongTask}.hide`, null);
  }

  history() {
    bus.publish('strong.task.change', 'strong-history');
  }

  historyClear() {
    bus.publish('strong.history.clear', null);
  }

  historyDelete(strongDef) {
    bus.publish('strong.history.delete', strongDef);
  }

  historyDown(strongDef) {
    bus.publish('strong.history.down', strongDef);
  }

  historySelect(strongDef) {
    bus.publish('strong.def.change', strongDef);
    bus.publish('strong.task.change', 'strong-def');
  }

  historyUp(strongDef) {
    bus.publish('strong.history.up', strongDef);
  }

  initialize() {
    this.subscribe();
  }

  lookup() {
    bus.publish('strong.task.change', 'strong-lookup');
  }

  lookupFind(strongNum) {
    bus.publish('strong.def.change', strongNum);
  }

  modeToggle() {
    bus.publish('strong.strong.mode.toggle', null);
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  readSelect(verseIdx) {
    let chapterPkg = getChapterPkg(verseIdx);
    bus.publish('chapterPkg.change', chapterPkg);
    if (this.panes === 1) {
      bus.publish('sidebar.select', 'none');
    }
    bus.publish('read.scroll-to-verse', verseIdx);
  }

  show() {
    bus.publish(`${this.strongTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  search() {
    bus.publish('strong.task.change', 'strong-result');
  }

  strongSelect(verseIdx) {
    bus.publish('strong.verse.change', verseIdx);
    bus.publish('strong.task.change', 'strong-verse');
  }

  subscribe() {
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });

    bus.subscribe('strong-def', () => {
      this.def();
    });
    bus.subscribe('strong-def.select', (strongDef) => {
      this.defSelect(strongDef);
    });
    bus.subscribe('strong-def.word.select', (strongWord) => {
      this.wordSelect(strongWord);
    });

    bus.subscribe('strong-filter', () => {
      this.filter();
    });
    bus.subscribe('strong-filter.select', (strongFilter) => {
      this.filterSelect(strongFilter);
    });

    bus.subscribe('strong-history', () => {
      this.history();
    });
    bus.subscribe('strong-history.clear', () => {
      this.historyClear();
    });
    bus.subscribe('strong-history.delete', (strongDef) => {
      this.historyDelete(strongDef);
    });
    bus.subscribe('strong-history.down', (strongDef) => {
      this.historyDown(strongDef);
    });
    bus.subscribe('strong-history.select', (strongDef) => {
      this.historySelect(strongDef);
    });
    bus.subscribe('strong-history.up', (strongDef) => {
      this.historyUp(strongDef);
    });

    bus.subscribe('strong-lookup', () => {
      this.lookup();
    });
    bus.subscribe('strong-lookup.find', (strongNum) => {
      this.lookupFind(strongNum);
    });

    bus.subscribe('strong-result', () => {
      this.search();
    });
    bus.subscribe('strong-result.read-select', (verseIdx) => {
      this.readSelect(verseIdx);
    });
    bus.subscribe('strong-result.strong-select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });

    bus.subscribe('strong-verse', () => {
      this.verse();
    });
    bus.subscribe('strong-verse.select', (strongDef) => {
      this.verseSelect(strongDef);
    });

    bus.subscribe('strong.back', () => {
      this.back();
    });
    bus.subscribe('strong.def.update', (strongDef) => {
      this.defUpdate(strongDef);
    });
    bus.subscribe('strong.hide', () => {
      this.hide();
    });
    bus.subscribe('strong.show', () => {
      this.show();
    });
    bus.subscribe('strong.strong.mode.click', () => {
      this.modeToggle();
    });
    bus.subscribe('strong.task.update', (strongTask) => {
      this.taskUpdate(strongTask);
    });
    bus.subscribe('strong.word.update', (strongWord) => {
      this.wordUpdate(strongWord);
    });
  }

  taskUpdate(strongTask) {
    if (this.sidebar === 'strong') {
      bus.publish(`${this.strongTask}.hide`, null);
      this.strongTask = strongTask;
      bus.publish(`${this.strongTask}.show`, null);
    } else {
      this.strongTask = strongTask;
    }
  }

  verse() {
    bus.publish('strong.task.change', 'strong-verse');
  }

  verseSelect(strongDef) {
    bus.publish('strong.def.change', strongDef);
    bus.publish('strong.word.first', null);
    bus.publish('strong.filter.reset', null);
    bus.publish('strong.task.change', 'strong-def');
  }

  wordSelect(strongWord) {
    bus.publish('strong.word.change', strongWord);
    bus.publish('strong.filter.reset', null);
    bus.publish('strong.task.change', 'strong-result');
  }

  wordUpdate(strongWord) {
    this.strongWord = strongWord;
  }

}

export { StrongController };
