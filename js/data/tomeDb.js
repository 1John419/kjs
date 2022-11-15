'use strict';

import {
  fetchJson,
  versionCheck
} from './dbUtil.js';
import { chapterLastVerseIdx } from './tomeIdx.js';
import { progress } from '../load.js';

const tomeSetup = {
  name: 'kjv',
  stores: {
    lists: 'k',
    verses: 'k',
    words: 'k'
  },
  url: '/json/kjv.json',
  version: '2020-01-07',
};

export let tomeAcrostics = {};
export let tomeBooks = null;
export let tomeChapters = null;
export let tomeCitations = [];
export let tomeDb = null;
export let tomeName = tomeSetup.name;
export let tomeVerseCount = null;
export let tomeWords = null;

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
  return tomeCitations[verseIdx];
};

export const initializeTome = async () => {
  progress('');
  progress('* tome database *');
  progress('');
  tomeDb = await versionCheck(tomeSetup);
  await populateTome();
  await loadTomeAcrostics();
  await loadTomeBooks();
  await loadTomeChapters();
  await loadTomeCitations();
  await loadTomeWords();
  tomeVerseCount = await tomeDb.verses.count();
  progress('tome initialized.');
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
    let data = await fetchJson(tomeSetup.url);

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
