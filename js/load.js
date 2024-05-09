'use strict';

import { progress } from '/js/progress.js';

const prod = true;

let newInstall = false;
let updateFound = false;

window.onload = () => {
  console.log(`window.onload:      ${Date.now()}`);
  progress('');
  progress('* Download app *');

  if (prod) {
    swEvents();
  } else {
    loadApp();
  }
};

const swEvents = () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(() => {
      console.log(`sw.ready:           ${Date.now()}`);
      if (!updateFound) {
        loadApp();
      } else {
        newInstall = true;
        console.log(`new install:        ${Date.now()}`);
      }
    }).catch((error) => {
      console.log(`sw.ready error: ${error.message}`);
    });
  }

  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log(`sw registered:      ${Date.now()}`);
    reg.onupdatefound = () => {
      updateFound = true;
      console.log(`reg.updatefound:    ${Date.now()}`);
      const newWorker = reg.installing;
      newWorker.onstatechange = (event) => {
        if (event.target.state === 'activated') {
          console.log(`nw.activated:       ${Date.now()}`);
          if (newInstall) {
            loadApp();
          } else {
            refresh();
          }
        }
      };
    };
  }).catch((error) => {
    console.log(`reg.error: ${error.message}`);
  });
};

const refresh = () => {
  console.log(`refresh():          ${Date.now()}`);
};

const loadApp = async () => {
  console.log(`loadApp():          ${Date.now()}`);
  progress('');
  progress('* Launch app *');

  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = '/css/font.css';
  document.head.appendChild(font);

  const script = document.createElement('script');
  if (prod) {
    script.src = '/bundle.js';
  } else {
    script.type = 'module';
    script.src = '/js/app.js';
  }
  document.body.appendChild(script);
};
