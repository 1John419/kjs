'use strict';

let prod = true;

let loadMsg = document.querySelector('.load-msg');
let loadScroll = document.querySelector('.load-scroll');
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

let swEvents = () => {
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

  navigator.serviceWorker.register('./sw.js').then((reg) => {
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

export const progress = (msg) => {
  loadMsg.innerHTML += msg + '<br>';
  loadScroll.scrollTop = loadScroll.scrollHeight;
};

const refresh = () => {
  console.log(`refresh():          ${Date.now()}`);
  // window.location.reload(true);
};

const loadApp = async () => {
  console.log(`loadApp():          ${Date.now()}`);
  progress('');
  progress('* Launch app *');

  let font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = './css/font.css';
  document.head.appendChild(font);

  let script = document.createElement('script');
  if (prod) {
    script.src = './bundle.js';
  } else {
    script.type = 'module';
    script.src = './js/app.js';
  }
  document.body.appendChild(script);
};
