'use strict';

import { progress } from '../progress.js';
import { dbUtil } from '../data/dbUtil.js';

const strongSetup = {
  name: 'strong_name',
  stores: {
    maps: 'k',
    words: 'k',
  },
  url: '/json/strong_name.json',
  version: '2024-05-09',
};

export let strongNameDb = null;

export const initializeStrongName = async () => {
  progress('');
  progress('* strong name database *');
  progress('');
  strongNameDb = await dbUtil.versionCheck(strongSetup);
  await populateStrong();
  progress('strong name initialized.');
};

const populateStrong = async () => {
  const wordsCount = await strongNameDb.words.count();
  if (wordsCount === 0) {
    const data = await dbUtil.fetchJson(strongSetup.url);

    progress('populating maps...');
    await strongNameDb.maps.bulkAdd(data.maps);
    progress('populating words...');
    await strongNameDb.words.bulkAdd(data.words);
    progress('population complete.');
  } else {
    progress('strong name already populated.');
  }
};
