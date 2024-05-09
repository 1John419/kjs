'use strict';

/*eslint no-unused-vars: ["off"]*/

import { DbModel } from './Model/DbModel.js';

import { ReadModel } from './Model/ReadModel.js';
import { ReadView } from './View/ReadView.js';
import { ReadController } from './Controller/ReadController.js';

import { NavigatorModel } from './Model/NavigatorModel.js';
import { NavigatorBookView } from './View/NavigatorBookView.js';
import { NavigatorChapterView } from './View/NavigatorChapterView.js';
import { NavigatorController } from './Controller/NavigatorController.js';

import { BookmarkModel } from './Model/BookmarkModel.js';
import { BookmarkListView } from './View/BookmarkListView.js';
import { BookmarkMoveCopyView } from './View/BookmarkMoveCopyView.js';
import { BookmarkFolderView } from './View/BookmarkFolderView.js';
import { BookmarkFolderAddView } from './View/BookmarkFolderAddView.js';
import { BookmarkFolderDeleteView } from './View/BookmarkFolderDeleteView.js';
import { BookmarkFolderRenameView } from './View/BookmarkFolderRenameView.js';
import { BookmarkExportview } from './View/BookmarkExportView.js';
import { BookmarkImportView } from './View/BookmarkImportView.js';
import { BookmarkController } from './Controller/BookmarkController.js';

import { SearchModel } from './Model/SearchModel.js';
import { SearchResultView } from './View/SearchResultView.js';
import { SearchFilterView } from './View/SearchFilterView.js';
import { SearchHistoryView } from './View/SearchHistoryView.js';
import { SearchLookupView } from './View/SearchLookupView.js';
import { SearchController } from './Controller/SearchController.js';

import { StrongModel } from './Model/StrongModel.js';
import { StrongDefView } from './View/StrongDefView.js';
import { StrongFilterView } from './View/StrongFilterView.js';
import { StrongHistoryView } from './View/StrongHistoryView.js';
import { StrongLookupView } from './View/StrongLookupView.js';
import { StrongResultView } from './View/StrongResultView.js';
import { StrongVerseView } from './View/StrongVerseView.js';
import { StrongController } from './Controller/StrongController.js';

import { SettingModel } from './Model/SettingModel.js';
import { SettingView } from './View/SettingView.js';
import { SettingController } from './Controller/SettingController.js';

import { HelpModel } from './Model/HelpModel.js';
import { HelpReadView } from './View/HelpReadView.js';
import { HelpTopicView } from './View/HelpTopicView.js';
import { HelpController } from './Controller/HelpController.js';
import { initializeKjvLists } from './data/kjvLists.js';
import { initializeKjvPureDb } from './data/kjvPureDb.js';
import { initializeKjvNameDb } from './data/kjvNameDb.js';
import { initializeStrongDictDb } from './data/strongDictDb.js';
import { initializeStrongPure } from './data/strongPureDb.js';
import { initializeStrongName } from './data/strongNameDb.js';

const APP_FONT = 'font--roboto';

const loadMsg = document.querySelector('.load-msg');
const loadScroll = document.querySelector('.load-scroll');

(async () => {
  const body = document.body;
  const load = body.querySelector('.load');

  await initializeKjvLists();
  await initializeKjvPureDb();
  await initializeKjvNameDb();
  await initializeStrongDictDb();
  await initializeStrongPure();
  await initializeStrongName();

  const dbModel = new DbModel();

  const readView = new ReadView();
  const readController = new ReadController();
  const readModel = new ReadModel();

  const navigatorBookView = new NavigatorBookView();
  const navigatorChapterView = new NavigatorChapterView();
  const navigatorController = new NavigatorController();
  const navigatorModel = new NavigatorModel();

  const bookmarkListView = new BookmarkListView();
  const bookmarkMoveCopyView = new BookmarkMoveCopyView();
  const bookmarkFolderView = new BookmarkFolderView();
  const bookmarkFolderAddView = new BookmarkFolderAddView();
  const bookmarkFolderDeleteView = new BookmarkFolderDeleteView();
  const bookmarkFolderRenameView = new BookmarkFolderRenameView();
  const bookmarkExportview = new BookmarkExportview();
  const bookmarkImportView = new BookmarkImportView();
  const bookmarkController = new BookmarkController();
  const bookmarkModel = new BookmarkModel();

  const searchResultView = new SearchResultView();
  const searchFilterView = new SearchFilterView();
  const searchHistoryView = new SearchHistoryView();
  const searchLookupView = new SearchLookupView();
  const searchController = new SearchController();
  const searchModel = new SearchModel();

  const strongDefView = new StrongDefView();
  const strongFilterView = new StrongFilterView();
  const strongHistoryView = new StrongHistoryView();
  const strongLookupView = new StrongLookupView();
  const strongSearchView = new StrongResultView();
  const strongVerseView = new StrongVerseView();
  const strongController = new StrongController();
  const strongModel = new StrongModel();

  const settingView = new SettingView();
  const settingController = new SettingController();
  const settingModel = new SettingModel();

  const helpReadView = new HelpReadView();
  const helpTopicView = new HelpTopicView();
  const helpController = new HelpController();
  const helpModel = new HelpModel();

  load.classList.add('hide');
  document.documentElement.classList.add(APP_FONT);

  console.log(`intializeApp():     ${Date.now()}`);
  readController.initializeApp();
  console.log(`ready:              ${Date.now()}`);

})();
