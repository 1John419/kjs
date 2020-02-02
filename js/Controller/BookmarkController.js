'use strict';

import { queue } from '../CommandQueue.js';
import { chapterIdxByVerseIdx } from '../data/tomeDb.js';

class BookmarkController {

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

  export () {
    queue.publish('bookmark.task.change', 'bookmark-export');
  }

  folder() {
    queue.publish('bookmark.task.change', 'bookmark-folder');
  }

  folderAdd() {
    queue.publish('bookmark.task.change', 'bookmark-folder-add');
  }

  folderAdded() {
    queue.publish('bookmark.task.change', 'bookmark-list');
  }

  folderAddSave(name) {
    queue.publish('bookmark.folder.add', name);
  }

  folderDelete(folderName) {
    queue.publish('folder.to.delete', folderName);
    queue.publish('bookmark.task.change', 'bookmark-folder-delete');
  }

  folderDeleteConfirm(folderName) {
    queue.publish('bookmark.folder.delete', folderName);
    queue.publish('bookmark.task.change', 'bookmark-folder');
  }

  folderDown(folderName) {
    queue.publish('bookmark.folder.down', folderName);
  }

  folderRename(folderName) {
    queue.publish('folder.to.rename', folderName);
    queue.publish('bookmark.task.change', 'bookmark-folder-rename');
  }

  folderRenamed() {
    queue.publish('bookmark.task.change', 'bookmark-folder');
  }

  folderRenameSave(namePkg) {
    queue.publish('bookmark.folder.rename', namePkg);
  }

  folderSelect(folderName) {
    queue.publish('bookmark.active-folder.change', folderName);
    queue.publish('bookmark.task.change', 'bookmark-list');
  }

  folderUp(folderName) {
    queue.publish('bookmark.folder.up', folderName);
  }

  gotoBookmark(verseIdx) {
    this.selectVerseIdx = verseIdx;
    let chapterIdx = chapterIdxByVerseIdx(verseIdx);
    queue.publish('chapterIdx.change', chapterIdx);
  }

  hide() {
    queue.publish(`${this.bookmarkTask}.hide`, null);
  }

  import() {
    queue.publish('bookmark.task.change', 'bookmark-import');
  }

  importImport(pkgStr) {
    queue.publish('bookmark.pkg.import', pkgStr);
  }

  initialize() {
    this.subscribe();
  }

  list() {
    queue.publish('bookmark.task.change', 'bookmark-list');
  }

  listDelete(verseIdx) {
    queue.publish('bookmark.delete', verseIdx);
  }

  listDown(verseIdx) {
    queue.publish('bookmark.down', verseIdx);
  }

  listSelect(verseIdx) {
    this.gotoBookmark(verseIdx);
  }

  listSortAscend() {
    queue.publish('bookmark.sort-ascend', null);
  }

  listSortInvert() {
    queue.publish('bookmark.sort-invert', null);
  }

  listUp(verseIdx) {
    queue.publish('bookmark.up', verseIdx);
  }

  modeToggle() {
    queue.publish('bookmark.strong-mode.toggle', null);
  }

  moveCopy(verseIdx) {
    queue.publish('bookmark-move-copy.list.change', verseIdx);
    queue.publish('bookmark.move-copy.change', verseIdx);
  }

  moveCopyCopy(copyPkg) {
    queue.publish('bookmark.copy', copyPkg);
  }

  moveCopyMove(movePkg) {
    queue.publish('bookmark.move', movePkg);
  }

  moveCopyReady() {
    queue.publish('bookmark.task.change', 'bookmark-move-copy');
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  show() {
    queue.publish(`${this.bookmarkTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  strongSelect(verseIdx) {
    this.strongSelectPending = true;
    queue.publish('strong.verse.change', verseIdx);
  }

  strongVerseUpdate() {
    if (this.strongSelectPending) {
      this.strongSelectPending = false;
      queue.publish('sidebar.change', 'strong');
    }
  }

  subscribe() {
    queue.subscribe('bookmark-export', () => {
      this.export();
    });

    queue.subscribe('bookmark-folder', () => {
      this.folder();
    });
    queue.subscribe('bookmark-folder.delete', (folderName) => {
      this.folderDelete(folderName);
    });
    queue.subscribe('bookmark-folder.down', (folderName) => {
      this.folderDown(folderName);
    });
    queue.subscribe('bookmark-folder.select', (folderName) => {
      this.folderSelect(folderName);
    });
    queue.subscribe('bookmark-folder.up', (folderName) => {
      this.folderUp(folderName);
    });

    queue.subscribe('bookmark-folder-add', () => {
      this.folderAdd();
    });
    queue.subscribe('bookmark-folder-add.save', (name) => {
      this.folderAddSave(name);
    });

    queue.subscribe('bookmark-folder-delete.confirm', (folderName) => {
      this.folderDeleteConfirm(folderName);
    });

    queue.subscribe('bookmark-folder-rename', (folderName) => {
      this.folderRename(folderName);
    });
    queue.subscribe('bookmark-folder-rename.save', (namePkg) => {
      this.folderRenameSave(namePkg);
    });

    queue.subscribe('bookmark-import', () => {
      this.import();
    });
    queue.subscribe('bookmark-import.import', (pkgStr) => {
      this.importImport(pkgStr);
    });

    queue.subscribe('bookmark-list', () => {
      this.list();
    });
    queue.subscribe('bookmark-list.delete', (verseIdx) => {
      this.listDelete(verseIdx);
    });
    queue.subscribe('bookmark-list.down', (verseIdx) => {
      this.listDown(verseIdx);
    });
    queue.subscribe('bookmark-list.select', (verseIdx) => {
      this.listSelect(verseIdx);
    });
    queue.subscribe('bookmark-list.sort-ascend', () => {
      this.listSortAscend();
    });
    queue.subscribe('bookmark-list.sort-invert', () => {
      this.listSortInvert();
    });
    queue.subscribe('bookmark-list.strong-select', (verseIdx) => {
      this.strongSelect(verseIdx);
    });
    queue.subscribe('bookmark-list.up', (verseIdx) => {
      this.listUp(verseIdx);
    });

    queue.subscribe('bookmark-move-copy', (verseIdx) => {
      this.moveCopy(verseIdx);
    });
    queue.subscribe('bookmark-move-copy.copy', (copyPkg) => {
      this.moveCopyCopy(copyPkg);
    });
    queue.subscribe('bookmark-move-copy.move', (movePkg) => {
      this.moveCopyMove(movePkg);
    });
    queue.subscribe('bookmark-move-copy.ready', () => {
      this.moveCopyReady();
    });

    queue.subscribe('bookmark.back', () => {
      this.back();
    });
    queue.subscribe('bookmark.copy', () => {
      this.list();
    });
    queue.subscribe('bookmark.folder.added', () => {
      this.folderAdded();
    });
    queue.subscribe('bookmark.folder.renamed', () => {
      this.folderRenamed();
    });
    queue.subscribe('bookmark.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark.move', () => {
      this.list();
    });
    queue.subscribe('bookmark.show', () => {
      this.show();
    });
    queue.subscribe('bookmark.strong-mode.click', () => {
      this.modeToggle();
    });
    queue.subscribe('bookmark.task.update', (bookmarkTask) => {
      this.taskUpdate(bookmarkTask);
    });

    queue.subscribe('chapterIdx.update', () => {
      this.chapterIdxUpdate();
    });

    queue.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    queue.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });

    queue.subscribe('strong.verse.update', () => {
      this.strongVerseUpdate();
    });
  }

  taskUpdate(bookmarkTask) {
    if (this.sidebar === 'bookmark') {
      if (this.bookmarkTask !== bookmarkTask) {
        queue.publish(`${this.bookmarkTask}.hide`, null);
        this.bookmarkTask = bookmarkTask;
        queue.publish(`${this.bookmarkTask}.show`, null);
      }
    } else {
      this.bookmarkTask = bookmarkTask;
    }
  }

}

export { BookmarkController };
