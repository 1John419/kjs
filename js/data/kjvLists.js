'use strict';

import { progress } from '../progress.js';
import { dbUtil } from '../data/dbUtil.js';
import { kjvIdx } from '../data/kjvIdx.js';

export let kjvLists;
const url = '/json/kjv_lists.json';

export const chapterIdxByVerseIdx = (verseIdx) => {
  const chapterIdx = kjvLists.chapters
    .findIndex(x => x[kjvIdx.chapter.lastVerseIdx] >= verseIdx);
  return chapterIdx;
};

export const firstVerseIdxByChapterIdx = (chapterIdx) => {
  const verseIdx = kjvLists.chapters[chapterIdx][kjvIdx.chapter.firstVerseIdx];
  return verseIdx;
};

export const initializeKjvLists = async () => {
  progress('loading kjv lists...');
  kjvLists = await dbUtil.fetchJson(url);
  kjvLists.name = 'kjv';
};
