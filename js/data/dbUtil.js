'use strict';

import Dexie from '../lib/dexie.js';
import { progress } from '../load.js';
import { appPrefix } from '../util.js';

const dbVersion = (dbName) => {
  let defaultVersion = 0;
  let version = localStorage.getItem(`${appPrefix}-${dbName}Version`);
  if (!version) {
    version = defaultVersion;
  } else {
    try {
      version = JSON.parse(version);
    } catch (error) {
      version = defaultVersion;
    }
    if (typeof version !== 'number') {
      version = defaultVersion;
    }
  }
  localStorage.setItem(`${appPrefix}-${dbName}Version`,
    JSON.stringify(version));

  return version;
};

export const fetchJson = async (url) => {
  progress('fetching...');
  let response = await fetch(url);
  progress('parsing...');
  let data = await response.json();

  return data;
};

export const versionCheck = async (name, stores, version) => {
  let currentVersion = dbVersion(name);

  let db = new Dexie(name);
  await db.version(1).stores(stores);
  db.open();

  if (version !== currentVersion) {
    progress('new version.');
    for (let store of Object.keys(stores)) {
      progress(`clearing ${store}...`);
      await db.table(store).clear();
    }
    localStorage.setItem(`${appPrefix}-${name}Version`,
      JSON.stringify(version));
  }

  return db;
};
