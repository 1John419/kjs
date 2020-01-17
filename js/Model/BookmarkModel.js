'use strict';

import { bus } from '../EventBus.js';
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

  activeFolderIsValid(activeFolder) {
    return this.folders.some((folder) => {
      return folder.folderName === activeFolder.folderName;
    });
  }

  add(verseIdx) {
    let bookmarks = this.folder.bookmarks;
    if (bookmarks.indexOf(verseIdx) === -1) {
      this.folder.bookmarks = [verseIdx, ...bookmarks];
      this.updateFolder();
    }
  }

  changeActiveFolder(folderName) {
    this.folder = this.getFolder(folderName);
    this.activeFolder = folderName;
    this.saveActiveFolder();
    this.updateFolder();
  }

  copy(copyPkg) {
    let toFolder = this.getFolder(copyPkg.to);
    toFolder.bookmarks = [copyPkg.verseIdx, ...toFolder.bookmarks];
    this.updateFolder();
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
    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== -1) {
      bookmarks.splice(index, 1);
      this.updateFolder();
    }
  }

  down(verseIdx) {
    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== bookmarks.length - 1 && index !== -1) {
      this.reorderBookmarks(index, index + 1);
    }
  }

  folderAdd(folderName) {
    let newFolder = this.getFolder(folderName);
    if (!newFolder) {
      newFolder = this.createFolder(folderName);
      this.folders = [newFolder, ...this.folders];
      this.folder = this.folders[firstEntry];
      this.activeFolder = folderName;
      this.saveActiveFolder();
      this.updateFolder();
    }
  }

  folderChange(folderName) {
    this.folder = this.getFolder(folderName);
    this.activeFolder = folderName;
    this.updateFolder();
  }

  folderDelete(folderName) {
    let idx = this.getFolderIdx(folderName);
    this.folders.splice(idx, 1);
    bus.publish('folder.list.update', this.getFolderList());
    this.resetFolder();
  }

  folderDown(folderName) {
    let index = this.folders.findIndex((folder) => folder.name === folderName);
    if (index !== this.folders.length - 1 && index !== -1) {
      this.reorderFolders(index, index + 1);
      bus.publish('folder.list.update', this.getFolderList());
    }
  }

  folderImport(pkgStr) {
    let bookmarkPkg = this.getBookmarkPkg(pkgStr);
    if (!bookmarkPkg) {
      bus.publish('bookmark-import.message', 'Invalid JSON string');
    } else {
      let status = this.validatePkg(bookmarkPkg);
      if (status === 'OK') {
        status = this.foldersAreValid(bookmarkPkg.folders);
      }
      if (status === 'OK') {
        this.importPkg(bookmarkPkg);
      } else {
        bus.publish('bookmark-import.message', status);
      }
    }
  }

  folderRename(namePkg) {
    let oldFolder = this.getFolder(namePkg.old);
    oldFolder.name = namePkg.new;
    this.activeFolder = namePkg.new;
    this.saveActiveFolder();
    this.updateFolder();
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
      bus.publish('folder.list.update', this.getFolderList());
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
    this.updateFolder();
    bus.publish('bookmark-import.message', 'Import successful.');
  }

  initialize() {
    this.maxIdx = tomeVerseCount - 1;
    this.subscribe();
  }

  modeChange(strongMode) {
    this.strongMode = strongMode;
    this.saveMode();
    bus.publish('bookmark.strong-mode.update', this.strongMode);
  }

  modeToogle() {
    this.modeChange(!this.strongMode);
  }

  move(movePkg) {
    let toFolder = this.getFolder(movePkg.to);
    toFolder.bookmarks = [movePkg.verseIdx, ...toFolder.bookmarks];

    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(movePkg.verseIdx);
    if (index !== -1) {
      bookmarks.splice(index, 1);
      this.updateFolder();
    }
  }

  async moveCopyChange(verseIdx) {
    this.moveCopyVerseObj = await tomeDb.verses.get(verseIdx);
    bus.publish('bookmark.move-copy.update', this.moveCopyVerseObj);
  }

  moveCopyListChange(verseIdx) {
    let foldersNotFoundIn = this.folders.filter(
      (folder) => !folder.bookmarks.some((element) => element === verseIdx)
    );
    let moveCopyList = foldersNotFoundIn.map((folder) => folder.name);
    bus.publish('bookmark-move-copy.list.update', moveCopyList);
  }

  reorderBookmarks(fromIdx, toIdx) {
    let bookmarks = this.folder.bookmarks;
    bookmarks.splice(
      toIdx, 0, bookmarks.splice(fromIdx, 1)[firstEntry]
    );
    this.updateFolder();
  }

  reorderFolders(fromIdx, toIdx) {
    this.folders.splice(
      toIdx, 0, this.folders.splice(fromIdx, 1)[firstEntry]
    );
    this.updateFolder();
    this.updateFolderList();
  }

  resetFolder() {
    if (this.folders.length === 0) {
      this.folderAdd('Default');
    }
    let firstFolder = this.folders[firstEntry].name;
    this.folderChange(firstFolder);
  }

  restore() {
    this.restoreFolders();
    this.restoreActiveFolder();
    this.restoreMode();
    this.restoreTask();
  }

  restoreActiveFolder() {
    let defaultFolder = 'Default';
    let activeFolder = localStorage.getItem(`${appPrefix}-activeFolder`);
    if (!activeFolder) {
      activeFolder = defaultFolder;
    } else {
      try {
        activeFolder = JSON.parse(activeFolder);
      } catch (error) {
        activeFolder = defaultFolder;
      }
      if (!this.activeFolderIsValid(activeFolder)) {
        activeFolder = defaultFolder;
      }
    }
    this.changeActiveFolder(activeFolder);
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
    this.modeChange(strongMode);
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

  saveActiveFolder() {
    localStorage.setItem(`${appPrefix}-activeFolder`,
      JSON.stringify(this.activeFolder));
  }

  saveBookmarkTask() {
    localStorage.setItem(`${appPrefix}-bookmarkTask`,
      JSON.stringify(this.bookmarkTask));
  }

  saveFolders() {
    localStorage.setItem(`${appPrefix}-folders`, JSON.stringify(this.folders));
    bus.publish('folders.update', this.folders);
  }

  saveMode() {
    localStorage.setItem(`${appPrefix}-bookmarkStrongMode`,
      JSON.stringify(this.strongMode));
  }

  sort(sorter) {
    let bookmarks = this.folder.bookmarks;
    if (bookmarks.length !== 0) {
      bookmarks.sort(sorter);
      this.updateFolder();
    }
  }

  sortInvert() {
    let bookmarks = this.folder.bookmarks;
    bookmarks.reverse();
    this.updateFolder();
  }

  subscribe() {
    bus.subscribe('bookmark.add', (verseIdx) => {
      this.add(verseIdx);
    });
    bus.subscribe('bookmark.copy', (copyPkg) => {
      this.copy(copyPkg);
    });
    bus.subscribe('bookmark.delete', (verseIdx) => {
      this.delete(verseIdx);
    });
    bus.subscribe('bookmark.down', (verseIdx) => {
      this.down(verseIdx);
    });
    bus.subscribe('bookmark.move', (movePkg) => {
      this.move(movePkg);
    });
    bus.subscribe('bookmark.restore', () => {
      this.restore();
    });
    bus.subscribe('bookmark.sort-ascend', () => {
      this.sort(numSortAscend);
    });
    bus.subscribe('bookmark.sort-invert', () => {
      this.sortInvert();
    });
    bus.subscribe('bookmark.strong-mode.toggle', () => {
      this.modeToogle();
    });
    bus.subscribe('bookmark.task.change', (bookmarkTask) => {
      this.taskChange(bookmarkTask);
    });
    bus.subscribe('bookmark.up', (verseIdx) => {
      this.up(verseIdx);
    });

    bus.subscribe('folder.add', (folderName) => {
      this.folderAdd(folderName);
    });
    bus.subscribe('folder.change', (folderName) => {
      this.folderChange(folderName);
    });
    bus.subscribe('folder.delete', (folderName) => {
      this.folderDelete(folderName);
    });
    bus.subscribe('folder.down', (folderName) => {
      this.folderDown(folderName);
    });
    bus.subscribe('folder.import', (pkgStr) => {
      this.folderImport(pkgStr);
    });
    bus.subscribe('folder.rename', (namePkg) => {
      this.folderRename(namePkg);
    });
    bus.subscribe('folder.up', (folderName) => {
      this.folderUp(folderName);
    });

    bus.subscribe('move-copy.list.change', (verseIdx) => {
      this.moveCopyListChange(verseIdx);
    });

    bus.subscribe('bookmark.move-copy.change', async (verseIdx) => {
      await this.moveCopyChange(verseIdx);
    });
  }

  taskChange(bookmarkTask) {
    this.bookmarkTask = bookmarkTask;
    this.saveBookmarkTask();
    bus.publish('bookmark.task.update', this.bookmarkTask);
  }

  up(verseIdx) {
    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== 0 && index !== -1) {
      this.reorderBookmarks(index, index - 1);
    }
  }

  updateFolder() {
    this.saveFolders();
    this.saveActiveFolder();
    bus.publish('folder.update', this.folder);
    bus.publish('folder.list.update', this.getFolderList());
  }

  updateFolderList() {
    this.saveFolders();
    bus.publish('folder.list.update', this.getFolderList());
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
