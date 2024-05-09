'use strict';

import { progress } from '../progress.js';
import { dbUtil } from '../data/dbUtil.js';

const strongSetup = {
  name: 'strong_pure',
  stores: {
    maps: 'k',
    words: 'k',
  },
  url: '/json/strong_pure.json',
  version: '2024-05-09',
};

export let strongPureDb = null;

export const initializeStrongPure = async () => {
  progress('');
  progress('* strong pure database *');
  progress('');
  strongPureDb = await dbUtil.versionCheck(strongSetup);
  await populateStrong();
  progress('strong pure initialized.');
};

const populateStrong = async () => {
  const wordsCount = await strongPureDb.words.count();
  if (wordsCount === 0) {
    const data = await dbUtil.fetchJson(strongSetup.url);

    progress('populating maps...');
    await strongPureDb.maps.bulkAdd(data.maps);
    progress('populating words...');
    await strongPureDb.words.bulkAdd(data.words);
    progress('population complete.');
  } else {
    progress('strong pure already populated.');
  }
};
