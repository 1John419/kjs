'use strict';

import { progress } from '../progress.js';
import { Dexie } from '../lib/dexie.v4.0.4.min.mjs';

export const dbUtil = {};

dbUtil.fetchJson = async (url) => {
  progress('fetching...');
  const response = await fetch(url);
  progress('parsing...');
  const data = await response.json();

  return data;
};

dbUtil.getVersion = (dbName) => {
  const defaultVersion = '1970-01-01';
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

dbUtil.versionCheck = async (dbSetup) => {
  const currentVersion = dbUtil.getVersion(dbSetup.name);

  const db = new Dexie(dbSetup.name);
  await db.version(1).stores(dbSetup.stores);
  db.open();

  if (dbSetup.version !== currentVersion) {
    progress('new version.');
    for (const store of Object.keys(dbSetup.stores)) {
      progress(`clearing ${store}...`);
      await db.table(store).clear();
    }
    localStorage.setItem(`${dbSetup.name}Version`,
      JSON.stringify(dbSetup.version));
  }

  return db;
};
