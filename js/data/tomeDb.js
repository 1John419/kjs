'use strict';

import Dexie from '../lib/dexie.js';
import { LZMA } from '../lib/decompress.js';
import {
  appPrefix,
  dbVersion
} from '../util.js';
import {
  chapterFirstVerseIdx,
  chapterLastVerseIdx,
  chapterName
} from './tomeIdx.js';

const tomeStores = {
  lists: 'k',
  verses: 'k',
  words: 'k'
};

const tomeLzmaUrl = './lzma/tome.kjv.json.lzma';
const tomeVersion = 1;

export const tomeName = 'KJV';

export let tomeAcrostics = {};
export let tomeBooks = null;
export let tomeChapters = null;
export let tomeCitations = [];
export let tomeDb = null;
export let tomeVerseCount = null;
export let tomeWords = null;

let progress = null;

export const chapterByVerseIdx = (verseIdx) => {
  let chapterIdx = chapterIdxByVerseIdx(verseIdx);
  return tomeChapters[chapterIdx];
};

export const chapterIdxByVerseIdx = (verseIdx) => {
  let chapterIdx = tomeChapters
    .findIndex(x => x[chapterLastVerseIdx] >= verseIdx);
  return chapterIdx;
};

export const citationByVerseIdx = (verseIdx) => {
  let chapter = chapterByVerseIdx(verseIdx);
  let num = verseIdx - chapter[chapterFirstVerseIdx] + 1;
  return `${chapter[chapterName]}:${num}`;
};

export const initializeTome = async (cb) => {
  progress = cb ? cb : () => {};
  progress('');
  progress('* tome database *');
  progress('');
  await versionCheck();
  await populateTome();
  await loadTomeAcrostics();
  await loadTomeBooks();
  await loadTomeChapters();
  await loadTomeCitations();
  await loadTomeWords();
  tomeVerseCount = await tomeDb.verses.count();
};

const loadTomeAcrostics = async () => {
  progress('loading acrostics...');
  let listObj = await tomeDb.lists.get('acrostics');
  tomeAcrostics = listObj.v;
};

const loadTomeBooks = async () => {
  progress('loading books...');
  let listObj = await tomeDb.lists.get('books');
  tomeBooks = listObj.v;
};

const loadTomeChapters = async () => {
  progress('loading chapters...');
  let listObj = await tomeDb.lists.get('chapters');
  tomeChapters = listObj.v;
};

const loadTomeCitations = async () => {
  progress('loading citations...');
  let listObj = await tomeDb.lists.get('citations');
  tomeCitations = listObj.v;
};

const loadTomeWords = async () => {
  progress('loading words...');
  let wordObjs = await tomeDb.words.toArray();
  tomeWords = wordObjs.map(x => x.k);
};

const populateTome = async () => {
  let wordCount = await tomeDb.words.count();
  if (wordCount === 0) {
    progress('fetching...');
    let response = await fetch(tomeLzmaUrl);

    progress('buffering...');
    let buffer = await response.arrayBuffer();

    progress('byte conversion...');
    let bytes = new Uint8Array(buffer);

    progress('decompressing...');
    let str = await LZMA.decompress(bytes);

    progress('parsing...');
    let data = JSON.parse(str);

    progress('populating lists...');
    await tomeDb.lists.bulkAdd(data.lists);
    progress('populating verses...');
    await tomeDb.verses.bulkAdd(data.verses);
    progress('populating words...');
    await tomeDb.words.bulkAdd(data.words);
    progress('population complete.');
  } else {
    progress('tome already populated.');
  }
};

const versionCheck = async () => {
  let currentVersion = dbVersion('tome');

  tomeDb = await new Dexie('tome');
  await tomeDb.version(1).stores(tomeStores);
  tomeDb.open();

  if (tomeVersion !== currentVersion) {
    progress('new version.');
    for (let store of Object.keys(tomeStores)) {
      progress(`clearing ${store}...`);
      await tomeDb.table(store).clear();
    }
    localStorage.setItem(`${appPrefix}-tomeVersion`,
      JSON.stringify(tomeVersion));
  }
};
