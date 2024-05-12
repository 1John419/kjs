'use strict';

export const util = {};

util.centerScrollElement = (scrollElement, element) => {
  const y = element.offsetTop - scrollElement.offsetTop -
    (scrollElement.clientHeight - element.clientHeight) / 2;
  scrollElement.scrollTop = y;
};

util.range = (start, stop, step = 1) => {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
};

util.removeAllChildren = (element) => {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
};

util.sideScrollElement = (scrollElement, element) => {
  const x = element.offsetLeft - 8;
  scrollElement.scrollLeft = x;
};

util.writeClipboardText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.log(error.message);
  }
};
