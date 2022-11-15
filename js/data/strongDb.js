'use strict';

import {
  fetchJson,
  versionCheck
} from './dbUtil.js';
import { progress } from '../load.js';
import { defTranliteration } from '../data/strongIdx.js';

const strongSetup = {
  name: 'strong',
  stores: {
    defs: 'k',
    maps: 'k',
    words: 'k',
  },
  url: '/json/strong.json',
  version: '2020-07-30',
};

export let strongCitations = {};
export let strongDb = null;
export let strongNums = null;

export const initializeStrong = async () => {
  progress('');
  progress('* strong database *');
  progress('');
  strongDb = await versionCheck(strongSetup);
  await populateStrong();
  await loadStrongNums();
  await loadStrongCitations();
  progress('strong initialized.');
};

const loadStrongCitations = async () => {
  progress('loading citations...');
  let defObjs = await strongDb.defs.toArray();
  defObjs.map(x => strongCitations[x.k] = x.v[defTranliteration]);
};

const loadStrongNums = async () => {
  progress('loading numbers...');
  let strongDefObjs = await strongDb.defs.toArray();
  strongNums = strongDefObjs.map(x => x.k);
};

const populateStrong = async () => {
  let wordsCount = await strongDb.words.count();
  if (wordsCount === 0) {
    let data = await fetchJson(strongSetup.url);

    progress('populating defs...');
    await strongDb.defs.bulkAdd(data.defs);
    progress('populating maps...');
    await strongDb.maps.bulkAdd(data.maps);
    progress('populating words...');
    await strongDb.words.bulkAdd(data.words);
    progress('population complete.');
  } else {
    progress('strong already populated.');
  }
};
