'use strict';

export const appPrefix = 'kjs';

export const centerScrollElement = (scrollElement, element) => {
  let y = element.offsetTop - scrollElement.offsetTop -
    (scrollElement.clientHeight - element.clientHeight) / 2;
  scrollElement.scrollTop = y;
};

export const dbVersion = (dbName) => {
  let defaultDbVersion = 0;
  let dbVersion = localStorage.getItem(`${appPrefix}-${dbName}Version`);
  if (!dbVersion) {
    dbVersion = defaultDbVersion;
  } else {
    try {
      dbVersion = JSON.parse(dbVersion);
    } catch (error) {
      dbVersion = defaultDbVersion;
    }
    if (typeof dbVersion !== 'number') {
      dbVersion = defaultDbVersion;
    }
  }
  localStorage.setItem(`${appPrefix}-${dbName}Version`,
    JSON.stringify(dbVersion));
  return dbVersion;
};

export const range = (start, stop, step = 1) => {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
};

export const removeAllChildren = (element) => {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
};

export const sideScrollElement = (scrollElement, element) => {
  let x = element.offsetLeft - 8;
  scrollElement.scrollLeft = x;
};
