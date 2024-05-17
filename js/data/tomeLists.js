'use strict';

import { progress } from '../progress.js';
import { dbUtil } from './dbUtil.js';
import { tomeIdx } from './tomeIdx.js';

export let tomeLists;
const url = '/json/kjv_lists.json';

export const chapterIdxByVerseIdx = (verseIdx) => {
  const chapterIdx = tomeLists.chapters
    .findIndex(x => x[tomeIdx.chapter.lastVerseIdx] >= verseIdx);
  return chapterIdx;
};

export const firstVerseIdxByChapterIdx = (chapterIdx) => {
  const verseIdx = tomeLists.chapters[chapterIdx][tomeIdx.chapter.firstVerseIdx];
  return verseIdx;
};

export const initializeTomeLists = async () => {
  progress('loading kja lists...');
  tomeLists = await dbUtil.fetchJson(url);
  tomeLists.tomeName = 'kjv';
};
