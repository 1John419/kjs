'use strict';

import { bus } from '../EventBus.js';
import { appPrefix } from '../util.js';

const validColumns = [ 1, 2, 3];

class ReadModel {

  constructor() {
    this.initialize();
  }

  columnChange(column) {
    this.column = column;
    this.saveColumn();
    bus.publish('column.update', this.column);
  }

  initialize() {
    this.subscribe();
  }

  modeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveMode();
    bus.publish('read.strong-mode.update', this.strongMode);
  }

  modeToogle() {
    this.modeChange(!this.strongMode);
  }

  panesChange(panes) {
    this.panes = panes;
    bus.publish('panes.update', this.panes);
  }

  restore() {
    this.restoreColumn();
    this.restoreMode();
  }

  restoreColumn() {
    let defaultColumn = 1;
    let column = localStorage.getItem(`${appPrefix}-column`);
    if (!column) {
      column = defaultColumn;
    } else {
      try {
        column = JSON.parse(column);
      } catch (error) {
        column = defaultColumn;
      }
      if (!validColumns.includes(column)) {
        column = defaultColumn;
      }
    }
    this.columnChange(column);
  }

  restoreMode() {
    let defaultMode = false;
    let strongMode = localStorage.getItem(`${appPrefix}-readStrongMode`);
    if (!strongMode) {
      strongMode = defaultMode;
    } else {
      try {
        strongMode = JSON.parse(strongMode);
      } catch (error) {
        strongMode = defaultMode;
      }
      if (typeof strongMode !== 'boolean') {
        strongMode = defaultMode;
      }
    }
    this.modeChange(strongMode);
  }

  saveColumn() {
    localStorage.setItem(`${appPrefix}-column`, JSON.stringify(this.column));
  }

  saveMode() {
    localStorage.setItem(`${appPrefix}-readStrongMode`,
      JSON.stringify(this.strongMode));
  }

  saveSidebar() {
    localStorage.setItem(`${appPrefix}-sidebar`, JSON.stringify(this.sidebar));
  }

  sidebarChange(sidebar) {
    this.sidebar = sidebar;
    this.saveSidebar();
    bus.publish('sidebar.update', this.sidebar);
  }

  sidebarRestore() {
    let defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
    let sidebar = localStorage.getItem(`${appPrefix}-sidebar`);
    if (!sidebar) {
      sidebar = defaultSidebar;
    } else {
      try {
        sidebar = JSON.parse(sidebar);
      } catch (error) {
        sidebar = defaultSidebar;
      }
    }
    if (this.panes > 1) {
      sidebar = sidebar === 'none' ? 'navigator' : sidebar;
    } else if (sidebar !== 'none') {
      sidebar = 'none';
    }
    this.sidebarChange(sidebar);
  }

  subscribe() {
    bus.subscribe('column.change',
      (column) => { this.columnChange(column); }
    );

    bus.subscribe('panes.change', (panes) => {
      this.panesChange(panes);
    });

    bus.subscribe('read.restore',
      () => { this.restore(); }
    );
    bus.subscribe('read.strong-mode.toggle', () => {
      this.modeToogle();
    });

    bus.subscribe('sidebar.change', (sidebar) => {
      this.sidebarChange(sidebar);
    });
    bus.subscribe('sidebar.restore', () => {
      this.sidebarRestore();
    });
  }

}

export { ReadModel };
