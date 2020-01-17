'use strict';

import Dexie from '../lib/dexie.js';
import { LZMA } from '../lib/decompress.js';
import { defTranliteration } from '../data/strongIdx.js';

const strongStores = {
  defs: 'k',
  maps: 'k',
  words: 'k'
};

const strongLzmaUrl = './lzma/strong.json.lzma';

let progress = null;
let strongCitations = {};
let strongDb = null;
let strongNums = null;

const initializeStrong = async (cb) => {
  progress = cb ? cb : () => {};
  progress('');
  progress('* strong database *');
  progress('');
  await openStrong();
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

const openStrong = async () => {
  strongDb = await new Dexie('strong');
  await strongDb.version(1).stores(strongStores);
  strongDb.open();
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

export {
  initializeStrong,
  strongCitations,
  strongDb,
  strongNums
};
