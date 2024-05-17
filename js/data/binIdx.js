'use strict';

export const binIdx = {};

binIdx.tomeBinIdx = {
  wordCount: 0,
  verseCount: 1,
  books: 2,
  verses: 3,
};

binIdx.bookBinIdx = {
  bookIdx: 0,
  wordCount: 1,
  verseCount: 2,
  sliceStart: 3,
  sliceEnd: 4,
  chapters: 5,
};

binIdx.chapterBinIdx = {
  chapterIdx: 0,
  wordCount: 1,
  verseCount: 2,
  sliceStart: 3,
  sliceEnd: 4,
};
