'use strict';

import {
  tomeChapters
} from './data/tomeDb.js';
import {
  chapterFirstVerseIdx,
  chapterLastVerseIdx,
  chapterName
} from './data/tomeIdx.js';

export const appPrefix = 'kjs-test';

export const centerScrollElement = (scrollElement, element) => {
  let y = element.offsetTop - scrollElement.offsetTop -
    (scrollElement.clientHeight - element.clientHeight) / 2;
  scrollElement.scrollTop = y;
};

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

export const range = (start, stop, step = 1) => {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
};

export const removeAllChildren = (element) => {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
};

export const sideScrollElement = (scrollElement, element) => {
  let x = element.offsetLeft - 8;
  scrollElement.scrollLeft = x;
};
