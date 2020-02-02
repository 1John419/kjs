'use strict';

import Dexie from '../lib/dexie.js';
import { LZMA } from '../lib/decompress.js';
import { defTranliteration } from '../data/strongIdx.js';
import {
  appPrefix,
  dbVersion
} from '../util.js';

const strongStores = {
  defs: 'k',
  maps: 'k',
  words: 'k'
};

const strongLzmaUrl = './lzma/strong.json.lzma';
const strongVersion = 1;

let progress = null;

export let strongCitations = {};
export let strongDb = null;
export let strongNums = null;

export const initializeStrong = async (cb) => {
  progress = cb ? cb : () => {};
  progress('');
  progress('* strong database *');
  progress('');
  await versionCheck();
  await populateStrong();
  await loadStrongNums();
  await loadStrongCitations();
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
    progress('fetching...');
    let response = await fetch(strongLzmaUrl);

    progress('buffering...');
    let buffer = await response.arrayBuffer();

    progress('byte conversion...');
    let bytes = new Uint8Array(buffer);

    progress('decompressing...');
    let str = await LZMA.decompress(bytes);

    progress('parsing...');
    let data = JSON.parse(str);

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

const versionCheck = async () => {
  let currentVersion = dbVersion('strong');

  strongDb = await new Dexie('strong');
  await strongDb.version(1).stores(strongStores);
  strongDb.open();

  if (strongVersion !== currentVersion) {
    progress('new version.');
    for (let store of Object.keys(strongStores)) {
      progress(`clearing ${store}...`);
      await strongDb.table(store).clear();
    }
    localStorage.setItem(`${appPrefix}-strongVersion`,
      JSON.stringify(strongVersion));
  }
};
