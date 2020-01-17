'use strict';

import {
  tomeBooks,
  tomeChapters,
  tomeDb,
  tomeWords
} from './data/tomeDb.js';
import {
  bookLastVerseIdx,
  chapterLastVerseIdx,
  verseText,
  wordCount,
  wordVerseIdx
} from './data/tomeIdx.js';
import {
  bookBinBookIdx,
  bookBinChapters,
  bookBinSliceEnd,
  bookBinVerseCount,
  bookBinWordCount,
  chapterBinChapterIdx,
  chapterBinSliceEnd,
  chapterBinVerseCount,
  chapterBinWordCount,
  tomeBinBooks,
  tomeBinVerseCount,
  tomeBinVerses,
  tomeBinWordCount
} from './data/binIdx.js';

const numSort = (a, b) => a - b;

// Credit: http://eddmann.com/posts/cartesian-product-in-javascript/
const flatten = (arr) => [].concat.apply([], arr);
const product = (sets) =>
  sets.reduce((acc, set) =>
    flatten(acc.map((x) => set.map((y) => [...x, y]))), [
    []
  ]);

const firstMatch = 1;
const firstSet = 0;
const secondSet = 1;

class SearchEngine {

  constructor() {
    this.initialize();
  }

  buildBins(verseIdx) {
    let tomeBin = this.rig.tomeBin;
    let versesLength = tomeBin[tomeBinVerses].length;
    tomeBin[tomeBinWordCount] += this.verseCount;
    tomeBin[tomeBinVerseCount] += 1;

    let book = tomeBooks.find(x => x[bookLastVerseIdx] >= verseIdx);
    let bookIdx = tomeBooks.indexOf(book);
    let chapter = tomeChapters.find(x => x[chapterLastVerseIdx] >= verseIdx);
    let chapterIdx = tomeChapters.indexOf(chapter);

    let bookBin = tomeBin[tomeBinBooks].find(
      x => x[bookBinBookIdx] === bookIdx
    );
    if (!bookBin) {
      let wordCount = 0;
      let verseCount = 0;
      let sliceStart = versesLength - 1;
      let sliceEnd = sliceStart;
      let chapters = [];
      tomeBin[tomeBinBooks].push([
        bookIdx,
        wordCount,
        verseCount,
        sliceStart,
        sliceEnd,
        chapters
      ]);
      bookBin = tomeBin[tomeBinBooks][tomeBin[tomeBinBooks].length - 1];
    }
    bookBin[bookBinWordCount] += this.verseCount;
    bookBin[bookBinVerseCount] += 1;
    bookBin[bookBinSliceEnd] += 1;

    let chapterBin = bookBin[bookBinChapters].find(
      (x) => x[chapterBinChapterIdx] === chapterIdx
    );
    if (!chapterBin) {
      let wordCount = 0;
      let verseCount = 0;
      let sliceStart = versesLength - 1;
      let sliceEnd = sliceStart;
      bookBin[bookBinChapters].push([
        chapterIdx,
        wordCount,
        verseCount,
        sliceStart,
        sliceEnd
      ]);
      chapterBin = bookBin[bookBinChapters][bookBin[bookBinChapters].length - 1];
    }
    chapterBin[chapterBinWordCount] += this.verseCount;
    chapterBin[chapterBinVerseCount] += 1;
    chapterBin[chapterBinSliceEnd] += 1;
  }

  buildCombinations() {
    this.combinations = product(this.patterns);
  }

  buildIntersects() {
    let verses = new Set();
    for (let set of this.sets) {
      let intersect = this.intersectAll(set);
      for (let verse of [...intersect]) {
        verses.add(verse);
      }
    }
    this.intersects = [...verses].sort(numSort);
  }

  buildPatterns() {
    this.rig.wordStatus = 'OK';
    this.patterns = [];
    let missingTerms = [];
    for (let term of this.terms) {
      let re = new RegExp(`^${term.replace(/\*/g, '.*')}$`, this.testFlags);
      let words = tomeWords.filter(x => re.test(x));
      if (words.length > 0) {
        this.patterns.push(words);
      } else {
        missingTerms.push(term);
      }
    }
    if (missingTerms.length > 0) {
      this.rig.wordStatus = `'${missingTerms.join(', ')}' not found`;
    }
  }

  async buildPhraseVerses() {
    let allVerses = [...this.intersects].sort(numSort);
    let verseObjs = await tomeDb.verses.bulkGet(allVerses);
    for (let verseObj of verseObjs) {
      this.verseIdx = verseObj.k;
      let re = this.buildRegExp(this.searchTerms, this.flags);
      let text = verseObj.v[verseText].replace(/[!();:,.?-]/g, '');
      this.verseCount = (text.match(re) || []).length;
      if (this.verseCount > 0) {
        this.rig.tomeBin[tomeBinVerses].push(this.verseIdx);
        this.buildBins(this.verseIdx);
      }
    }
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
      this.testFlags = query.startsWith('@') ? '' : 'i';
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

  async buildSets() {
    this.sets = [];

    let unique = [...new Set([].concat.apply([], this.combinations))].sort();
    this.wordObjs = await tomeDb.words.bulkGet(unique);

    let words = {};
    this.wordObjs.map(obj => words[obj.k] = obj.v);

    for (let combination of this.combinations) {
      let comboSets = [];
      for (let word of combination) {
        let verseKeys = words[word].map(x => x[wordVerseIdx]);
        comboSets.push(new Set(verseKeys));
      }
      this.sets.push(comboSets);
    }
  }

  async buildWords() {
    let allVerses = [...this.intersects];
    for (let verseIdx of allVerses) {
      this.verseIdx = verseIdx;
      this.getVerseCount(verseIdx);
      if (this.verseCount > 0) {
        this.rig.tomeBin[tomeBinVerses].push(this.verseIdx);
        this.buildBins(this.verseIdx);
      }
    }
  }

  async buildVerses() {
    if (this.rig.type === 'PHRASE') {
      await this.buildPhraseVerses(this.rig);
    } else if (this.rig.type === 'WORD') {
      await this.buildWords(this.rig);
    }
  }

  findAllMatches(str, regEx) {
    let result;
    let matches = [];
    while ((result = regEx.exec(str)) !== null) {
      matches.push(result[firstMatch]);
    }
    return matches.length === 0 ? undefined : matches;
  }

  getVerseCount(verseIdx) {
    this.verseCount = 0;
    for (let wordVerseObj of this.wordObjs) {
      let verseCount = wordVerseObj.v.find(x => x[wordVerseIdx] === verseIdx);
      if (verseCount) {
        this.verseCount += verseCount[wordCount];
      }
    }
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
      if (Array.isArray(sets[firstSet])) {
        sets = [...sets[firstSet]];
        numOfSets = sets.length;
      }
      if (numOfSets < 2) {
        intersect = sets[firstSet];
      } else {
        intersect = this.intersection(sets[firstSet], sets[secondSet]);
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

  async performSearch(query) {
    this.buildRig(query);
    this.initializeTomeBin();
    if (this.rig.type === 'WORD' || this.rig.type === 'PHRASE') {
      this.buildPatterns();
      if (this.rig.wordStatus === 'OK') {
        this.rig.state = 'OK';
        this.buildCombinations();
        await this.buildSets();
        this.buildIntersects();
        await this.buildVerses();
      }
    }
    return this.rig;
  }

  subscribe() {}

}

export { SearchEngine };
