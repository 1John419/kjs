'use strict';

export const kjvIdx = {};

kjvIdx.book = {
  longName: 0,
  shortName: 1,
  firstVerseIdx: 2,
  lastVerseIdx: 3,
  firstChapterIdx: 4,
  lastChapterIdx: 5,
};

kjvIdx.chapter = {
  bookIdx: 0,
  name: 1,
  num: 2,
  firstVerseIdx: 3,
  lastVerseIdx: 4,
};

kjvIdx.verse = {
  text: 0,
  bookIdx: 1,
  chapterIdx: 2,
  citation: 3,
  num: 4,
};

kjvIdx.word = {
  verseIdx: 0,
  count: 1,
};
