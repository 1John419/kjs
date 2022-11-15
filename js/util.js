'use strict';

export const centerScrollElement = (scrollElement, element) => {
  let y = element.offsetTop - scrollElement.offsetTop -
    (scrollElement.clientHeight - element.clientHeight) / 2;
  scrollElement.scrollTop = y;
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
