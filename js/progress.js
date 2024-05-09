const loadMsg = document.querySelector('.load-msg');
const loadScroll = document.querySelector('.load-scroll');

export const progress = (msg) => {
  loadMsg.innerHTML += msg + '<br>';
  loadScroll.scrollTop = loadScroll.scrollHeight;
};
