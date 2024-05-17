'use strict';

import { progress } from '../progress.js';
import { dbUtil } from '../data/dbUtil.js';

const dbSetup = {
  name: 'kjv_pure',
  stores: {
    verses: 'k',
    words: 'k',
  },
  url: '/json/kjv_pure.json',
  version: '2024-05-09',
};

export let kjvPureDb = null;
export let kjvPureVerseCount = null;
export let kjvPureWords = null;

export const initializeKjvPureDb = async () => {
  progress('');
  progress('* kjv pure database *');
  progress('');
  kjvPureDb = await dbUtil.versionCheck(dbSetup);
  await populateDb();
  await loadKjvPureWords();
  kjvPureVerseCount = await kjvPureDb.verses.count();
  progress('kjv pure initialized.');
};

const loadKjvPureWords = async () => {
  progress('loading kjv pure words...');
  const wordObjs = await kjvPureDb.words.toArray();
  kjvPureWords = wordObjs.map(x => x.k);
};

const populateDb = async () => {
  const wordCount = await kjvPureDb.words.count();
  if (wordCount === 0) {
    const data = await dbUtil.fetchJson(dbSetup.url);

    progress('populating kjv pure verses...');
    await kjvPureDb.verses.bulkAdd(data.verses);
    progress('populating kjv pure words...');
    await kjvPureDb.words.bulkAdd(data.words);
    progress('kjv pure population complete.');
  } else {
    progress('kjv pure already populated.');
  }
};
