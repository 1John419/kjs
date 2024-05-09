'use strict';

import { progress } from '../progress.js';
import { dbUtil } from '../data/dbUtil.js';
import { strongIdx } from '../data/strongIdx.js';

const strongSetup = {
  name: 'strong_dict',
  stores: {
    dict: 'k',
  },
  url: '/json/strong_dict.json',
  version: '2024-05-09',
};

export const strongCitations = {};
export let strongDictDb = null;
export let strongNums = null;

export const initializeStrongDictDb = async () => {
  progress('');
  progress('* strong dictionary database *');
  progress('');
  strongDictDb = await dbUtil.versionCheck(strongSetup);
  await populateStrong();
  await loadStrongCitations();
  await loadStrongNums();
  progress('strong initialized.');
};

const loadStrongCitations = async () => {
  progress('loading strong citations...');
  const defObjs = await strongDictDb.dict.toArray();
  defObjs.map(x => strongCitations[x.k] = x.v[strongIdx.def.tranliteration]);
};

const loadStrongNums = async () => {
  progress('loading strong numbers...');
  const strongDictObjs = await strongDictDb.dict.toArray();
  strongNums = strongDictObjs.map(x => x.k);
};

const populateStrong = async () => {
  const dictCount = await strongDictDb.dict.count();
  if (dictCount === 0) {
    const data = await dbUtil.fetchJson(strongSetup.url);

    progress('populating dict...');
    await strongDictDb.dict.bulkAdd(data);
    progress('population complete.');
  } else {
    progress('strong dictionary already populated.');
  }
};
