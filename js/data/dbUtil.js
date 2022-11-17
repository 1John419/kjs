'use strict';

import {
  progress,
} from '../load.js';
import {
  Dexie,
} from '../lib/dexie.min.mjs';

export const fetchJson = async (url) => {
  progress('fetching...');
  let response = await fetch(url);
  progress('parsing...');
  let data = await response.json();

  return data;
};

const getVersion = (dbName) => {
  let defaultVersion = '1970-01-01';
  let version = localStorage.getItem(`${dbName}Version`);
  if (!version) {
    version = defaultVersion;
  } else {
    try {
      version = JSON.parse(version);
    } catch (error) {
      version = defaultVersion;
    }
    if (typeof version !== 'string') {
      version = defaultVersion;
    }
  }
  localStorage.setItem(`${dbName}Version`,
    JSON.stringify(version));

  return version;
};

export const versionCheck = async (dbSetup) => {
  let currentVersion = getVersion(dbSetup.name);

  let db = new Dexie(dbSetup.name);
  await db.version(1).stores(dbSetup.stores);
  db.open();

  if (dbSetup.version !== currentVersion) {
    progress('new version.');
    for (let store of Object.keys(dbSetup.stores)) {
      progress(`clearing ${store}...`);
      await db.table(store).clear();
    }
    localStorage.setItem(`${dbSetup.name}Version`,
      JSON.stringify(dbSetup.version));
  }

  return db;
};
