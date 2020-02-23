'use strict';

import queue from '../CommandQueue.js';
import {
  tomeDb,
  tomeName,
  tomeVerseCount
} from '../data/tomeDb.js';
import { appPrefix } from '../util.js';

const numSortAscend = (a, b) => a - b;

const bookmarkFolderReroute = ['bookmark-folder-add', 'bookmark-folder-delete',
  'bookmark-folder-rename', 'bookmark-export', 'bookmark-import'
];
const bookmarkListReroute = ['bookmark-move-copy'];
const validTasks = ['bookmark-list', 'bookmark-folder'];

const firstEntry = 0;

class BookmarkModel {

  constructor() {
    this.initialize();
  }

  activeFolderChange(activeFolderName) {
    this.activeFolderName = activeFolderName;
    this.updateActiveFolderName();
    this.updateActiveFolder();
  }

  add(verseIdx) {
    let bookmarks = this.activeFolder.bookmarks;
    if (bookmarks.indexOf(verseIdx) === -1) {
      this.activeFolder.bookmarks = [verseIdx, ...bookmarks];
      this.updateFolders();
      this.updateActiveFolder();
    }
  }

  copy(copyPkg) {
    let toFolder = this.getFolder(copyPkg.to);
    toFolder.bookmarks = [copyPkg.verseIdx, ...toFolder.bookmarks];
    this.updateFolders();
  }

  createFolder(folderName) {
    return {
      name: folderName,
      bookmarks: []
    };
  }

  createFolders() {
    return [this.createFolder('Default')];
  }

  delete(verseIdx) {
    let bookmarks = this.activeFolder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== -1) {
      bookmarks.splice(index, 1);
      this.updateFolders();
      this.updateActiveFolder();
    }
  }

  down(verseIdx) {
    let bookmarks = this.activeFolder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== bookmarks.length - 1 && index !== -1) {
      this.reorderBookmarks(index, index + 1);
      this.updateFolders();
      this.updateActiveFolder();
    }
  }

  folderAdd(folderName) {
    let newFolder = this.getFolder(folderName);
    if (!newFolder) {
      newFolder = this.createFolder(folderName);
      this.folders = [newFolder, ...this.folders];
      this.updateFolders();
      this.activeFolderChange(folderName);
      this.updateFolderList();
      queue.publish('bookmark.folder.added', null);
    } else {
      queue.publish('bookmark.folder.add.error', 'Duplicate Folder Name');
    }
  }

  folderDelete(folderName) {
    let idx = this.getFolderIdx(folderName);
    this.folders.splice(idx, 1);
    if (this.folders.length === 0) {
      this.folderAdd('Default');
    }
    this.updateFolders();
    let firstFolderName = this.folders[firstEntry].name;
    this.activeFolderChange(firstFolderName);
    this.updateFolderList();
  }

  folderDown(folderName) {
    let index = this.folders.findIndex((folder) => folder.name === folderName);
    if (index !== this.folders.length - 1 && index !== -1) {
      this.reorderFolders(index, index + 1);
      this.updateFolders();
      this.updateFolderList();
    }
  }

  folderImport(pkgStr) {
    let bookmarkPkg = this.getBookmarkPkg(pkgStr);
    if (!bookmarkPkg) {
      queue.publish('bookmark-import.message', 'Invalid JSON string');
    } else {
      let status = this.validatePkg(bookmarkPkg);
      if (status === 'OK') {
        status = this.foldersAreValid(bookmarkPkg.folders);
      }
      if (status === 'OK') {
        this.importPkg(bookmarkPkg);
      } else {
        queue.publish('bookmark-import.message', status);
      }
    }
  }

  folderNameIsValid(folderName) {
    return this.folders.some((folder) => {
      return folder.name === folderName;
    });
  }

  folderRename(namePkg) {
    if (namePkg.old === namePkg.new) {
      queue.publish('bookmark.folder.rename.error', 'Duplicate Folder Name');
    } else {
      let oldFolder = this.getFolder(namePkg.old);
      oldFolder.name = namePkg.new;
      this.updateFolders();
      this.updateFolderList();
      if (this.activeFolderName === namePkg.old) {
        this.activeFolderChange(namePkg.new);
      }
      queue.publish('bookmark.folder.renamed', null);
    }
  }

  foldersAreValid(folders) {
    let status = 'OK';
    let error = false;
    try {
      folders.some((folder) => {
        if (
          !folder.name ||
          typeof folder.name !== 'string' ||
          !folder.bookmarks ||
          !Array.isArray(folder.bookmarks)
        ) {
          status = 'Invalid folder structure';
          error = true;
        }
        if (!error) {
          error = folder.bookmarks.some((bookmark) => {
            if (
              !Number.isInteger(bookmark) ||
              bookmark < 0 ||
              bookmark > this.maxIdx
            ) {
              status = 'Invalid verse';
              error = true;
            }
            return error;
          });
        }
        return error;
      });
    } catch (error) {
      status = 'ERROR';
    }
    return status;
  }

  folderUp(folderName) {
    let index = this.folders.findIndex((folder) => folder.name === folderName);
    if (index !== 0 && index !== -1) {
      this.reorderFolders(index, index - 1);
      this.updateFolders();
      this.updateFolderList();
    }
  }

  getBookmarkPkg(pkgStr) {
    let bookmarkPkg;
    try {
      bookmarkPkg = JSON.parse(pkgStr);
    } catch (error) {
      bookmarkPkg = null;
    }
    return bookmarkPkg;
  }

  getFolder(folderName) {
    return this.folders.find((folder) => {
      return folder.name === folderName;
    });
  }

  getFolderIdx(folderName) {
    return this.folders.findIndex((folder) => {
      return folder.name === folderName;
    });
  }

  getFolderList() {
    return this.folders.map((folder) => folder.name);
  }

  importPkg(bookmarkPkg) {
    for (let folder of bookmarkPkg.folders) {
      let targetFolder = this.getFolder(folder.name);
      if (!targetFolder) {
        targetFolder = this.createFolder(folder.name);
        this.folders = [targetFolder, ...this.folders];
      }
      for (let verseIdx of folder.bookmarks) {
        let bookmarks = targetFolder.bookmarks;
        if (bookmarks.indexOf(verseIdx) !== -1) {
          continue;
        }
        targetFolder.bookmarks = [verseIdx, ...bookmarks];
      }
    }
    this.updateFolders();
    this.updateFolderList();
    queue.publish('bookmark-import.message', 'Import successful.');
  }

  initialize() {
    this.maxIdx = tomeVerseCount - 1;
    this.subscribe();
  }

  move(movePkg) {
    let toFolder = this.getFolder(movePkg.to);
    toFolder.bookmarks = [movePkg.verseIdx, ...toFolder.bookmarks];

    let bookmarks = this.activeFolder.bookmarks;
    let index = bookmarks.indexOf(movePkg.verseIdx);
    if (index !== -1) {
      bookmarks.splice(index, 1);
      this.updateFolders();
      this.updateActiveFolder(this.activeFolderName);
    }
  }

  async moveCopyChange(verseIdx) {
    this.moveCopyVerseObj = await tomeDb.verses.get(verseIdx);
    queue.publish('bookmark.move-copy.update', this.moveCopyVerseObj);
  }

  moveCopyListChange(verseIdx) {
    let foldersNotFoundIn = this.folders.filter(
      (folder) => !folder.bookmarks.some((element) => element === verseIdx)
    );
    let moveCopyList = foldersNotFoundIn.map((folder) => folder.name);
    queue.publish('bookmark-move-copy.list.update', moveCopyList);
  }

  reorderBookmarks(fromIdx, toIdx) {
    let bookmarks = this.activeFolder.bookmarks;
    bookmarks.splice(
      toIdx, 0, bookmarks.splice(fromIdx, 1)[firstEntry]
    );
  }

  reorderFolders(fromIdx, toIdx) {
    this.folders.splice(
      toIdx, 0, this.folders.splice(fromIdx, 1)[firstEntry]
    );
  }

  restore() {
    this.restoreTask();
    this.restoreFolders();
    this.restoreActiveFolderName();
    this.restoreMode();
  }

  restoreActiveFolderName() {
    let defaultFolderName = 'Default';
    let activeFolderName =
      localStorage.getItem(`${appPrefix}-activeFolderName`);
    if (!activeFolderName) {
      activeFolderName = defaultFolderName;
    } else {
      try {
        activeFolderName = JSON.parse(activeFolderName);
      } catch (error) {
        activeFolderName = defaultFolderName;
      }
      if (!this.folderNameIsValid(activeFolderName)) {
        activeFolderName = defaultFolderName;
      }
    }
    this.activeFolderChange(activeFolderName);
  }

  restoreFolders() {
    let defaultFolders = this.createFolders();
    let folders = localStorage.getItem(`${appPrefix}-folders`);
    if (!folders) {
      folders = defaultFolders;
    } else {
      try {
        folders = JSON.parse(folders);
      } catch (error) {
        folders = defaultFolders;
      }
      if (!this.foldersAreValid(folders)) {
        folders = defaultFolders;
      }
    }
    this.folders = folders;
    this.updateFolders();
    this.updateFolderList();
  }

  restoreMode() {
    let defaultMode = false;
    let strongMode = localStorage.getItem(`${appPrefix}-bookmarkStrongMode`);
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
    this.strongModeChange(strongMode);
  }

  restoreTask() {
    let defaultTask = 'bookmark-list';
    let bookmarkTask = localStorage.getItem(`${appPrefix}-bookmarkTask`);
    if (!bookmarkTask) {
      bookmarkTask = defaultTask;
    } else {
      try {
        bookmarkTask = JSON.parse(bookmarkTask);
      } catch (error) {
        bookmarkTask = defaultTask;
      }
      if (bookmarkListReroute.includes(bookmarkTask)) {
        bookmarkTask = 'bookmark-list';
      } else if (bookmarkFolderReroute.includes(bookmarkTask)) {
        bookmarkTask = 'bookmark-folder';
      } else if (!validTasks.includes(bookmarkTask)) {
        bookmarkTask = defaultTask;
      }
    }
    this.taskChange(bookmarkTask);
  }

  saveActiveFolderName() {
    localStorage.setItem(`${appPrefix}-activeFolderName`,
      JSON.stringify(this.activeFolderName));
  }

  saveBookmarkTask() {
    localStorage.setItem(`${appPrefix}-bookmarkTask`,
      JSON.stringify(this.bookmarkTask));
  }

  saveFolders() {
    localStorage.setItem(`${appPrefix}-folders`, JSON.stringify(this.folders));
  }

  saveStrongMode() {
    localStorage.setItem(`${appPrefix}-bookmarkStrongMode`,
      JSON.stringify(this.strongMode));
  }

  sort(sorter) {
    let bookmarks = this.activeFolder.bookmarks;
    if (bookmarks.length !== 0) {
      bookmarks.sort(sorter);
      this.updateFolders();
      this.updateActiveFolder(this.activeFolderName);
    }
  }

  sortInvert() {
    let bookmarks = this.activeFolder.bookmarks;
    bookmarks.reverse();
    this.updateFolders();
    this.updateActiveFolder(this.activeFolderName);
  }

  strongModeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveStrongMode();
    queue.publish('bookmark.strong-mode.update', this.strongMode);
  }

  strongModeToogle() {
    this.strongModeChange(!this.strongMode);
  }

  subscribe() {
    queue.subscribe('bookmark.active-folder.change', (folderName) => {
      this.activeFolderChange(folderName);
    });
    queue.subscribe('bookmark.add', (verseIdx) => {
      this.add(verseIdx);
    });
    queue.subscribe('bookmark.copy', (copyPkg) => {
      this.copy(copyPkg);
    });
    queue.subscribe('bookmark.delete', (verseIdx) => {
      this.delete(verseIdx);
    });
    queue.subscribe('bookmark.down', (verseIdx) => {
      this.down(verseIdx);
    });
    queue.subscribe('bookmark.folder.add', (folderName) => {
      this.folderAdd(folderName);
    });
    queue.subscribe('bookmark.folder.delete', (folderName) => {
      this.folderDelete(folderName);
    });
    queue.subscribe('bookmark.folder.down', (folderName) => {
      this.folderDown(folderName);
    });
    queue.subscribe('bookmark.pkg.import', (pkgStr) => {
      this.folderImport(pkgStr);
    });
    queue.subscribe('bookmark.folder.rename', (namePkg) => {
      this.folderRename(namePkg);
    });
    queue.subscribe('bookmark.folder.up', (folderName) => {
      this.folderUp(folderName);
    });
    queue.subscribe('bookmark.move', (movePkg) => {
      this.move(movePkg);
    });
    queue.subscribe('bookmark.move-copy.change', async (verseIdx) => {
      await this.moveCopyChange(verseIdx);
    });
    queue.subscribe('bookmark.restore', () => {
      this.restore();
    });
    queue.subscribe('bookmark.sort-ascend', () => {
      this.sort(numSortAscend);
    });
    queue.subscribe('bookmark.sort-invert', () => {
      this.sortInvert();
    });
    queue.subscribe('bookmark.strong-mode.toggle', () => {
      this.strongModeToogle();
    });
    queue.subscribe('bookmark.task.change', (bookmarkTask) => {
      this.taskChange(bookmarkTask);
    });
    queue.subscribe('bookmark.up', (verseIdx) => {
      this.up(verseIdx);
    });

    queue.subscribe('bookmark-move-copy.list.change', (verseIdx) => {
      this.moveCopyListChange(verseIdx);
    });
  }

  taskChange(bookmarkTask) {
    this.bookmarkTask = bookmarkTask;
    this.saveBookmarkTask();
    queue.publish('bookmark.task.update', this.bookmarkTask);
  }

  up(verseIdx) {
    let bookmarks = this.activeFolder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== 0 && index !== -1) {
      this.reorderBookmarks(index, index - 1);
      this.updateFolders();
      this.updateActiveFolder();
    }
  }

  updateActiveFolder() {
    this.activeFolder = this.getFolder(this.activeFolderName);
    queue.publish('bookmark.active-folder.update', this.activeFolder);
  }

  updateActiveFolderName() {
    this.saveActiveFolderName();
  }

  updateFolderList() {
    queue.publish('bookmark.folder-list.update', this.getFolderList());
  }

  updateFolders() {
    this.saveFolders();
    queue.publish('bookmark.folders.update', this.folders);
  }

  validatePkg(bookmarkPkg) {
    let status = 'OK';
    if (
      !bookmarkPkg.tome ||
      !bookmarkPkg.folders ||
      !Array.isArray(bookmarkPkg.folders)
    ) {
      status = 'Invalid package structure';
    }
    if (bookmarkPkg.tome !== tomeName) {
      status = 'Tome mismatch';
    }
    return status;
  }
}

export { BookmarkModel };
