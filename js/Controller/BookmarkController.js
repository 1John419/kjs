'use strict';

import { bus } from '../EventBus.js';
import { chapterIdxByVerseIdx } from '../util.js';

class BookmarkController {

  constructor() {
    this.initialize();
  }

  back() {
    bus.publish('sidebar.change', 'none');
  }

  chapterIdxUpdate() {
    if (this.selectVerseIdx) {
      if (this.panes === 1 && this.sidebar !== 'none') {
        bus.publish('sidebar.select', 'none');
      }
      bus.publish('read.scroll-to-verse', this.selectVerseIdx);
      this.selectVerseIdx = null;
    }
  }

  export() {
    bus.publish('bookmark.task.change', 'bookmark-export');
  }

  folder() {
    bus.publish('bookmark.task.change', 'bookmark-folder');
  }

  folderAdd() {
    bus.publish('bookmark.task.change', 'bookmark-folder-add');
  }

  folderAdded() {
    bus.publish('bookmark.task.change', 'bookmark-list');
  }

  folderAddSave(name) {
    bus.publish('folder.add', name);
  }

  folderDelete(folderName) {
    bus.publish('folder.to.delete', folderName);
    bus.publish('bookmark.task.change', 'bookmark-folder-delete');
  }

  folderDeleteConfirm(folderName) {
    bus.publish('folder.delete', folderName);
    bus.publish('bookmark.task.change', 'bookmark-folder');
  }

  folderDown(folderName) {
    bus.publish('folder.down', folderName);
  }

  folderRename(folderName) {
    bus.publish('folder.to.rename', folderName);
    bus.publish('bookmark.task.change', 'bookmark-folder-rename');
  }

  folderRenameSave(namePkg) {
    bus.publish('folder.rename', namePkg);
    bus.publish('bookmark.task.change', 'bookmark-folder');
  }

  folderSelect(folderName) {
    bus.publish('folder.change', folderName);
    bus.publish('bookmark.task.change', 'bookmark-list');
  }

  folderUp(folderName) {
    bus.publish('folder.up', folderName);
  }

  gotoBookmark(verseIdx) {
    this.selectVerseIdx = verseIdx;
    let chapterIdx = chapterIdxByVerseIdx(verseIdx);
    bus.publish('chapterIdx.change', chapterIdx);
  }

  hide() {
    bus.publish(`${this.bookmarkTask}.hide`, null);
  }

  import() {
    bus.publish('bookmark.task.change', 'bookmark-import');
  }

  importImport(pkgStr) {
    bus.publish('folder.import', pkgStr);
  }

  initialize() {
    this.subscribe();
  }

  list() {
    bus.publish('bookmark.task.change', 'bookmark-list');
  }

  listDelete(verseIdx) {
    bus.publish('bookmark.delete', verseIdx);
  }

  listDown(verseIdx) {
    bus.publish('bookmark.down', verseIdx);
  }

  listSelect(verseIdx) {
    this.gotoBookmark(verseIdx);
  }

  listSortAscend() {
    bus.publish('bookmark.sort-ascend', null);
  }

  listSortInvert() {
    bus.publish('bookmark.sort-invert', null);
  }

  listUp(verseIdx) {
    bus.publish('bookmark.up', verseIdx);
  }

  modeToggle() {
    bus.publish('bookmark.strong-mode.toggle', null);
  }

  moveCopy(verseIdx) {
    bus.publish('move-copy.list.change', verseIdx);
    bus.publish('bookmark.move-copy.change', verseIdx);
  }

  moveCopyCopy(copyPkg) {
    bus.publish('bookmark.copy', copyPkg);
  }

  moveCopyMove(movePkg) {
    bus.publish('bookmark.move', movePkg);
  }

  moveCopyReady() {
    bus.publish('bookmark.task.change', 'bookmark-move-copy');
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  show() {
    bus.publish(`${this.bookmarkTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  strongSelect(verseIdx) {
    bus.publish('strong.verse.change', verseIdx);
    bus.publish('strong.task.change', 'strong-verse');
    bus.publish('sidebar.change', 'strong');
  }

  subscribe() {
    bus.subscribe('bookmark-export', () => {
      this.export();
    });

    bus.subscribe('bookmark-folder', () => {
      this.folder();
    });
    bus.subscribe('bookmark-folder.delete', (folderName) => {
      this.folderDelete(folderName);
    });
    bus.subscribe('bookmark-folder.down', (folderName) => {
      this.folderDown(folderName);
    });
    bus.subscribe('bookmark-folder.select', (folderName) => {
      this.folderSelect(folderName);
    });
    bus.subscribe('bookmark-folder.up', (folderName) => {
      this.folderUp(folderName);
    });

    bus.subscribe('bookmark-folder-add', () => {
      this.folderAdd();
    });
    bus.subscribe('bookmark-folder-add.save', (name) => {
      this.folderAddSave(name);
    });

    bus.subscribe('bookmark-folder-delete.confirm', (folderName) => {
      this.folderDeleteConfirm(folderName);
    });

    bus.subscribe('bookmark-folder-rename', (folderName) => {
      this.folderRename(folderName);
    });
    bus.subscribe('bookmark-folder-rename.save', (namePkg) => {
      this.folderRenameSave(namePkg);
    });

    bus.subscribe('bookmark-import', () => {
      this.import();
    });
    bus.subscribe('bookmark-import.import', (pkgStr) => {
      this.importImport(pkgStr);
    });

    bus.subscribe('bookmark-list', () => {
      this.list();
    });
    bus.subscribe('bookmark-list.delete', (verseIdx) => {
      this.listDelete(verseIdx);
    });
    bus.subscribe('bookmark-list.down', (verseIdx) => {
      this.listDown(verseIdx);
    });
    bus.subscribe('bookmark-list.select', (verseIdx) => {
      this.listSelect(verseIdx);
    });
    bus.subscribe('bookmark-list.sort-ascend', () => {
      this.listSortAscend();
    });
    bus.subscribe('bookmark-list.sort-invert', () => {
      this.listSortInvert();
    });
    bus.subscribe('bookmark-list.strong-select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });
    bus.subscribe('bookmark-list.up', (verseIdx) => {
      this.listUp(verseIdx);
    });

    bus.subscribe('bookmark-move-copy', (verseIdx) => {
      this.moveCopy(verseIdx);
    });
    bus.subscribe('bookmark-move-copy.copy', (copyPkg) => {
      this.moveCopyCopy(copyPkg);
    });
    bus.subscribe('bookmark-move-copy.move', (movePkg) => {
      this.moveCopyMove(movePkg);
    });
    bus.subscribe('bookmark-move-copy.ready', () => {
      this.moveCopyReady();
    });

    bus.subscribe('bookmark.back', () => {
      this.back();
    });
    bus.subscribe('bookmark.copy', () => {
      this.list();
    });
    bus.subscribe('bookmark.hide', () => {
      this.hide();
    });
    bus.subscribe('bookmark.move', () => {
      this.list();
    });
    bus.subscribe('bookmark.show', () => {
      this.show();
    });
    bus.subscribe('bookmark.strong-mode.click', () => {
      this.modeToggle();
    });
    bus.subscribe('bookmark.task.update', (bookmarkTask) => {
      this.taskUpdate(bookmarkTask);
    });

    bus.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    bus.subscribe('folder.added', () => {
      this.folderAdded();
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
  }

  taskUpdate(bookmarkTask) {
    if (this.sidebar === 'bookmark') {
      bus.publish(`${this.bookmarkTask}.hide`, null);
      this.bookmarkTask = bookmarkTask;
      bus.publish(`${this.bookmarkTask}.show`, null);
    } else {
      this.bookmarkTask = bookmarkTask;
    }
  }

}

export { BookmarkController };
