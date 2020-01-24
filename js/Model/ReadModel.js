'use strict';

import { bus } from '../EventBus.js';
import { appPrefix } from '../util.js';

class ReadModel {

  constructor() {
    this.initialize();
  }

  columnModeChange(columnMode) {
    this.columnMode = columnMode;
    this.saveColumnMode();
    bus.publish('read.column-mode.update', this.columnMode);
  }

  columnModeToogle() {
    this.columnModeChange(!this.columnMode);
  }

  initialize() {
    this.subscribe();
  }

  panesChange(panes) {
    this.panes = panes;
    bus.publish('panes.update', this.panes);
  }

  restore() {
    this.restoreColumnMode();
    this.restoreStrongMode();
  }

  restoreColumnMode() {
    let defaultColumnMode = false;
    let columnMode = localStorage.getItem(`${appPrefix}-columnMode`);
    if (!columnMode) {
      columnMode = defaultColumnMode;
    } else {
      try {
        columnMode = JSON.parse(columnMode);
      } catch (error) {
        columnMode = defaultColumnMode;
      }
      if (typeof columnMode !== 'boolean') {
        columnMode = defaultColumnMode;
      }
    }
    this.columnModeChange(columnMode);
  }

  restoreStrongMode() {
    let defaultStrongMode = false;
    let strongMode = localStorage.getItem(`${appPrefix}-readStrongMode`);
    if (!strongMode) {
      strongMode = defaultStrongMode;
    } else {
      try {
        strongMode = JSON.parse(strongMode);
      } catch (error) {
        strongMode = defaultStrongMode;
      }
      if (typeof strongMode !== 'boolean') {
        strongMode = defaultStrongMode;
      }
    }
    this.strongModeChange(strongMode);
  }

  saveColumnMode() {
    localStorage.setItem(`${appPrefix}-columnMode`, JSON.stringify(this.columnMode));
  }

  saveStrongMode() {
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

  strongModeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveStrongMode();
    bus.publish('read.strong-mode.update', this.strongMode);
  }

  strongModeToogle() {
    this.strongModeChange(!this.strongMode);
  }

  subscribe() {
    bus.subscribe('panes.change', (panes) => {
      this.panesChange(panes);
    });

    bus.subscribe('read.column-mode.toggle', () => {
      this.columnModeToogle();
    });
    bus.subscribe('read.restore',
      () => { this.restore(); }
    );
    bus.subscribe('read.strong-mode.toggle', () => {
      this.strongModeToogle();
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
