'use strict';

import { progress } from '../progress.js';
import { dbUtil } from '../data/dbUtil.js';

const dbSetup = {
  name: 'kjv_name',
  stores: {
    verses: 'k',
    words: 'k',
  },
  url: '/json/kjv_name.json',
  version: '2024-05-09',
};

export let kjvNameDb = null;
export const kjvNameName = dbSetup.name;
export let kjvNameWords = null;

export const initializeKjvNameDb = async () => {
  progress('');
  progress('* kjv name database *');
  progress('');
  kjvNameDb = await dbUtil.versionCheck(dbSetup);
  await populateKjv();
  await loadKjvNameWords();
  progress('kjv name initialized.');
};


const loadKjvNameWords = async () => {
  progress('loading kjv name words...');
  const wordObjs = await kjvNameDb.words.toArray();
  kjvNameWords = wordObjs.map(x => x.k);
};

const populateKjv = async () => {
  const wordCount = await kjvNameDb.words.count();
  if (wordCount === 0) {
    const data = await dbUtil.fetchJson(dbSetup.url);

    progress('populating kjv name verses...');
    await kjvNameDb.verses.bulkAdd(data.verses);
    progress('populating kjv name words...');
    await kjvNameDb.words.bulkAdd(data.words);
    progress('kjv name population complete.');
  } else {
    progress('kjv name already populated.');
  }
};
