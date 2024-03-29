'use strict';

import {
  queue,
} from '../CommandQueue.js';

class ReadModel {

  constructor() {
    this.initialize();
  }

  columnModeChange(columnMode) {
    this.columnMode = columnMode;
    this.saveColumnMode();
    queue.publish('read.column-mode.update', this.columnMode);
  }

  columnModeToogle() {
    this.columnModeChange(!this.columnMode);
  }

  initialize() {
    this.subscribe();
  }

  nameModeChange(nameMode) {
    this.nameMode = nameMode;
    this.saveNameMode();
    queue.publish('read.name-mode.update', this.nameMode);
  }

  nameModeToogle() {
    this.nameModeChange(!this.nameMode);
  }

  panesChange(panes) {
    this.panes = panes;
    queue.publish('panes.update', this.panes);
  }

  restore() {
    this.restoreColumnMode();
    this.restoreStrongMode();
    this.restoreNameMode();
    this.restoreSidebar();
  }

  restoreColumnMode() {
    let defaultColumnMode = false;
    let columnMode = localStorage.getItem('columnMode');
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

  restoreNameMode() {
    let defaultNameMode = true;
    let nameMode = localStorage.getItem('readNameMode');
    if (!nameMode) {
      nameMode = defaultNameMode;
    } else {
      try {
        nameMode = JSON.parse(nameMode);
      } catch (error) {
        nameMode = defaultNameMode;
      }
      if (typeof nameMode !== 'boolean') {
        nameMode = defaultNameMode;
      }
    }
    this.nameModeChange(nameMode);
  }

  restoreSidebar() {
    let defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
    let sidebar = localStorage.getItem('sidebar');
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

  restoreStrongMode() {
    let defaultStrongMode = false;
    let strongMode = localStorage.getItem('readStrongMode');
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
    localStorage.setItem('columnMode',
      JSON.stringify(this.columnMode));
  }

  saveNameMode() {
    localStorage.setItem('readNameMode',
      JSON.stringify(this.nameMode));
  }

  saveStrongMode() {
    localStorage.setItem('readStrongMode',
      JSON.stringify(this.strongMode));
  }

  saveSidebar() {
    localStorage.setItem('sidebar', JSON.stringify(this.sidebar));
  }

  sidebarChange(sidebar) {
    this.sidebar = sidebar;
    this.saveSidebar();
    queue.publish('sidebar.update', this.sidebar);
  }

  strongModeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveStrongMode();
    queue.publish('read.strong-mode.update', this.strongMode);
  }

  strongModeToogle() {
    this.strongModeChange(!this.strongMode);
  }

  subscribe() {
    queue.subscribe('panes.change', (panes) => {
      this.panesChange(panes);
    });

    queue.subscribe('read.column-mode.toggle', () => {
      this.columnModeToogle();
    });
    queue.subscribe('read.name-mode.toggle', () => {
      this.nameModeToogle();
    });
    queue.subscribe('read.restore',
      () => { this.restore(); }
    );
    queue.subscribe('read.strong-mode.toggle', () => {
      this.strongModeToogle();
    });

    queue.subscribe('sidebar.change', (sidebar) => {
      this.sidebarChange(sidebar);
    });
  }

}

export { ReadModel };
