'use strict';

import { tome } from './Tome/tome.js';

import {
  idxBook,
  idxChapter,
} from './tomeIdx.js';

const numSort = (a, b) => a - b;

// Credit: http://eddmann.com/posts/cartesian-product-in-javascript/
const flatten = (arr) => [].concat.apply([], arr);
const product = (sets) =>
  sets.reduce((acc, set) =>
    flatten(acc.map((x) => set.map((y) => [...x, y]))), [
    []
  ]);

const IdxTomeWordCount = 0;
const idxTomeVerseCount = 1;
const idxBookIdx = 0;
const idxChapterIdx = 0;
const idxWordCount = 1;
const idxVerseCount = 2;
const idxSliceEnd = 4;
const idxBooks = 2;
const idxVerses = 3;
const idxChapters = 5;

class SearchEngine {

  constructor() {
    this.initialize();
  }

  buildBins() {
    let tomeBin = this.rig.tomeBin;
    let versesLength = tomeBin[idxVerses].length;
    tomeBin[IdxTomeWordCount] += this.verseCount;
    tomeBin[idxTomeVerseCount] += 1;

    let ref = tome.refs[this.verseIdx];
    let bookIdx = ref[idxBook];
    let chapterIdx = ref[idxChapter];

    let bookBin = tomeBin[idxBooks].find(
      (x) => x[idxBookIdx] === bookIdx
    );
    if (!bookBin) {
      let wordCount = 0;
      let verseCount = 0;
      let sliceStart = versesLength - 1;
      let sliceEnd = sliceStart;
      let chapters = [];
      tomeBin[idxBooks].push([
        bookIdx,
        wordCount,
        verseCount,
        sliceStart,
        sliceEnd,
        chapters
      ]);
      bookBin = tomeBin[idxBooks][tomeBin[idxBooks].length - 1];
    }
    bookBin[idxWordCount] += this.verseCount;
    bookBin[idxVerseCount] += 1;
    bookBin[idxSliceEnd] += 1;

    let chapterBin = bookBin[idxChapters].find(
      (x) => x[idxChapterIdx] === chapterIdx
    );
    if (!chapterBin) {
      let wordCount = 0;
      let verseCount = 0;
      let sliceStart = versesLength - 1;
      let sliceEnd = sliceStart;
      bookBin[idxChapters].push([
        chapterIdx,
        wordCount,
        verseCount,
        sliceStart,
        sliceEnd
      ]);
      chapterBin = bookBin[idxChapters][bookBin[idxChapters].length - 1];
    }
    chapterBin[idxWordCount] += this.verseCount;
    chapterBin[idxVerseCount] += 1;
    chapterBin[idxSliceEnd] += 1;
  }

  buildRegExp(term, flags) {
    let regexStr = term.replace(/\*/g, '[\\w\']*');
    regexStr = term.endsWith('*') ?
      `\\b(${regexStr})` :
      `\\b(${regexStr})( |$)`;
    return new RegExp(regexStr, flags);
  }

  buildRig(query) {
    this.rig = {};
    this.rig.state = 'ERROR';
    this.rig.query = query;
    if (query === '') {
      this.rig.type = 'EMPTY';
    } else {
      this.rig.type = 'INVALID';
      this.flags = query.startsWith('@') ? 'g' : 'gi';
      this.searchTerms = this.rig.query
        .replace('@', '')
        .trim()
        .replace(/ {2,}/g, ' ')
        .replace(/ *,+ */g, ',');
      if (
        !this.searchTerms.match(/[^a-z ,'*-]/i) &&
        !(/^\*$|^\* | \* | \*$|^\*,|,\*,|,\*$/g.test(this.searchTerms)) &&
        !(/^,|,$/g.test(this.searchTerms)) &&
        !(
          this.searchTerms.includes(' ') &&
          this.searchTerms.includes(',')
        )
      ) {
        this.terms = this.searchTerms
          .replace(/-/g, '').split(/[ ,]/);
        if (
          this.rig.query.includes(',') ||
          this.terms.length === 1
        ) {
          this.rig.type = 'WORD';
        } else {
          this.rig.type = 'PHRASE';
        }
      }
    }
  }

  buildSearchCombinations() {
    this.combinations = product(this.patterns);
  }

  buildSearchIntersects() {
    let verses = new Set();
    for (let set of this.sets) {
      let intersect = this.intersectAll(set);
      for (let verse of [...intersect]) {
        verses.add(verse);
      }
    }
    this.intersects = [...verses].sort(numSort);
  }

  buildSearchPatterns() {
    this.rig.tomeWords = 'OK';
    this.patterns = [];
    let missingTerms = [];
    for (let term of this.terms) {
      let regExp = this.buildRegExp(term, 'gi');
      let words = this.getTomeWords(regExp);
      if (words.length > 0) {
        this.patterns.push(words);
      } else {
        missingTerms.push(term);
      }
    }
    if (missingTerms.length > 0) {
      this.rig.tomeWords = `'${missingTerms.join(', ')}' not found`;
    }
  }

  buildSearchPhraseVerses() {
    let allVerses = [...this.intersects].sort(numSort);
    for (let idx of allVerses) {
      this.verseIdx = idx;
      let text = tome.verses[idx].replace(/[!();:,.?-]/g, '');
      let regExp = this.buildRegExp(
        this.searchTerms, this.flags
      );
      this.verseCount = (text.match(regExp) || []).length;
      if (this.verseCount > 0) {
        this.rig.tomeBin[idxVerses].push(idx);
        this.buildBins();
      }
    }
  }

  buildSearchSets() {
    this.sets = [];
    for (let combination of this.combinations) {
      let comboSets = [];
      for (let word of combination) {
        comboSets.push(new Set(tome.wordVerses[word]));
      }
      this.sets.push(comboSets);
    }
  }

  buildSearchWordVerses() {
    let allVerses = [...this.intersects].sort(numSort);
    for (let idx of allVerses) {
      this.verseIdx = idx;
      let text = tome.verses[idx].replace(/[!();:,.?-]/g, '');
      this.verseCount = 0;
      let error = false;
      this.terms.every((term) => {
        let regExp = this.buildRegExp(term, this.flags);
        let hits = (text.match(regExp) || []).length;
        if (hits === 0) {
          this.verseCount = 0;
        } else {
          this.verseCount += hits;
          error = true;
        }
        return error;
      });
      if (this.verseCount > 0) {
        this.rig.tomeBin[idxVerses].push(idx);
        this.buildBins();
      }
    }
  }

  buildSearchVerses() {
    this.initializeTomeBin();
    if (this.rig.type === 'PHRASE') {
      this.buildSearchPhraseVerses(this.rig);
    } else if (this.rig.type === 'WORD') {
      this.buildSearchWordVerses(this.rig);
    }
  }

  findAllMatches(str, regEx) {
    let result;
    let matches = [];
    while ((result = regEx.exec(str)) !== null) {
      matches.push(result[1]);
    }
    return matches.length === 0 ? undefined : matches;
  }

  getTomeWords(regExp) {
    let tomeWords = [];
    let words = this.findAllMatches(tome.wordList, regExp);
    if (words) {
      tomeWords = tomeWords.concat(words);
    }
    return tomeWords;
  }

  initialize() {
    this.subscribe();
  }

  initializeTomeBin() {
    let wordCount = 0;
    let verseCount = 0;
    let books = [];
    let verses = [];
    this.rig.tomeBin = [
      wordCount,
      verseCount,
      books,
      verses
    ];
  }

  intersectAll(...sets) {
    let intersect = undefined;
    let numOfSets = sets.length;
    if (numOfSets > 0) {
      if (Array.isArray(sets[0])) {
        sets = [...sets[0]];
        numOfSets = sets.length;
      }
      if (numOfSets < 2) {
        intersect = sets[0];
      } else {
        intersect = this.intersection(sets[0], sets[1]);
        if (numOfSets > 2) {
          for (let i = 2; i < numOfSets; i++) {
            intersect = this.intersection(intersect, sets[i]);
          }
        }
      }
    }
    return intersect;
  }

  intersection(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
  }

  performSearch(query) {
    this.buildRig(query);
    if (
      this.rig.type === 'WORD' ||
      this.rig.type === 'PHRASE'
    ) {
      this.buildSearchPatterns();
      if (this.rig.tomeWords === 'OK') {
        this.rig.state = 'OK';
        this.buildSearchCombinations();
        this.buildSearchSets();
        this.buildSearchIntersects();
        this.buildSearchVerses();
      }
    }
    return this.rig;
  }

  subscribe() {}

}

export { SearchEngine };
