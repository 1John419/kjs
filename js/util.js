'use strict';

import { tome } from './Tome/tome.js';

import {
  idxBook,
  idxChapter,
  idxChapterNum,
  idxLongName,
  idxVerseNum
} from './tomeIdx.js';

export const appPrefix = 'kjs';

export const centerScrollElement = (scrollElement, element) => {
  let y = element.offsetTop -
    (scrollElement.clientHeight - element.clientHeight) / 2;
  scrollElement.scrollTop = y;
};

export const getBookName = (bookIdx) => {
  return tome.books[bookIdx][idxLongName];
};

export const getChapterName = (chapterIdx) => {
  let chapter = tome.chapters[chapterIdx];
  let book = tome.books[chapter[idxBook]];
  return `${book[idxLongName]} ${chapter[idxChapterNum]}`;
};

export const getChapterPkg = (verseIdx) => {
  let ref = tome.refs[verseIdx];
  let bookIdx = ref[idxBook];
  let chapterIdx = ref[idxChapter];
  let chapterName = getChapterName(chapterIdx);
  let chapterPkg = {
    bookIdx,
    chapterIdx,
    chapterName
  };
  return chapterPkg;
};

export const getRefName = (verseIdx) => {
  let ref = tome.refs[verseIdx];
  let chapterIdx = ref[idxChapter];
  let chapterName = getChapterName(chapterIdx);
  let verseNum = ref[idxVerseNum];
  return `${chapterName}:${verseNum}`;
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
