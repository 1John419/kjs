'use strict';

import {
  tomeAcrostics,
} from './data/tomeDb.js';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

export const templateAcrostic = (verseObj) => {
  let acrosticSpan = undefined;
  if (tomeAcrostics) {
    let acrostic = tomeAcrostics[verseObj.k];
    if (acrostic) {
      let glyph = acrostic.slice(0, 1);
      let xlit = acrostic.slice(1);
      let glyphSpan = templateElement('span', 'font--hebrew', null, '', glyph);
      let xlitSpan = templateElement('span', 'font--bold', null, '', xlit + ' ');
      acrosticSpan = document.createDocumentFragment();
      acrosticSpan.appendChild(glyphSpan);
      acrosticSpan.appendChild(xlitSpan);
    }
  }
  return acrosticSpan;
};

export const templateActionMenu = (cssModifier, actionSet) => {
  let actionMenu = templateElement(
    'div', 'action-menu', cssModifier, null, null);
  actionMenu.classList.add('action-menu--hide');
  for (let btn of actionSet) {
    let element = templateBtnIcon(btn.icon, btn.icon, btn.label);
    actionMenu.appendChild(element);
  }
  return actionMenu;
};

export const templateBtnIcon = (svgId, cssModifier, ariaLabel) => {
  let svgTag = document.createElementNS(svgNS, 'svg');
  svgTag.classList.add('icon-svg');
  let useTag = document.createElementNS(svgNS, 'use');
  useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
  svgTag.appendChild(useTag);
  let btnIcon = templateElement(
    'button', 'btn-icon', cssModifier, ariaLabel, null);
  btnIcon.appendChild(svgTag);
  return btnIcon;
};

export const templateDivDialog = (cssModifier, toolSet) => {
  let divDialog = templateElement(
    'div', 'dialog', cssModifier, null, null);
  let divDialogBtns = templateElement(
    'div', 'dialog-btns', cssModifier, null, null);
  for (let tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = templateElement(
        'button', 'btn-dialog', tool.cssModifier, tool.ariaLabel, tool.ariaLabel);
      divDialogBtns.appendChild(element);
    } else if (tool.type === 'input') {
      element = templateInput('dialog-input', cssModifier, tool.ariaLabel);
      divDialog.appendChild(element);
    } else if (tool.type === 'label') {
      element = templateElement(
        'div', 'dialog-label', cssModifier, null, null);
      if (tool.text) {
        element.textContent = tool.text;
      }
      divDialog.appendChild(element);
    } else if (tool.type === 'textarea') {
      element = templateElement(
        'textarea', 'dialog-textarea', cssModifier, tool.ariaLabel, null);
      divDialog.appendChild(element);
    }
  }
  divDialog.appendChild(divDialogBtns);
  return divDialog;
};

export const templateElement = (tagName, cssBlock, cssModifier, ariaLabel, textContent) => {
  let element = document.createElement(tagName);
  element.classList.add(cssBlock);
  if (cssModifier) {
    element.classList.add(`${cssBlock}--${cssModifier}`);
  }
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
};

export const templateInput = (cssBlock, cssModifier, ariaLabel) => {
  let input = templateElement(
    'input', cssBlock, cssModifier, ariaLabel, null);
  input.setAttribute('type', 'text');
  return input;
};

export const templatePage = (cssModifier) => {
  let page = templateElement(
    'div', 'page', cssModifier, null, null);
  page.classList.add('page--hide');
  return page;
};

export const templateScroll = (cssModifier) => {
  let scroll = templateElement(
    'div', 'scroll', cssModifier, null, null);
  return scroll;
};

export const templateToolbar = (cssModifier) => {
  let toolbar = templateElement(
    'div', 'toolbar', cssModifier, null, null);
  return toolbar;
};

export const templateToolbarLower = (toolSet) => {
  let toolbarLower = templateToolbar('lower');
  for (let tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = templateBtnIcon(tool.icon, tool.icon, tool.ariaLabel);
      toolbarLower.appendChild(element);
    } else if (tool.type === 'input') {
      element = templateInput('input', tool.modifier, tool.ariaLabel);
      toolbarLower.appendChild(element);
    }
  }
  return toolbarLower;
};

export const templateToolbarMenu = (modifier, actionSet) => {
  let toolbarMenu = templateElement(
    'div', 'toolbar-menu', modifier, null, null);
  toolbarMenu.classList.add('toolbar-menu--hide');
  for (let btn of actionSet) {
    let element = templateBtnIcon(btn.icon, `${modifier}-${btn.icon}`, btn.label);
    toolbarMenu.appendChild(element);
  }
  return toolbarMenu;
};

export const templateToolbarUpper = (toolSet) => {
  let toolbarUpper = templateToolbar('upper');
  for (let tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = templateBtnIcon(tool.icon, tool.icon, tool.ariaLabel);
      toolbarUpper.appendChild(element);
    } else if (tool.type === 'banner') {
      element = templateElement(
        'div', 'banner', tool.cssModifier, null, tool.text);
      toolbarUpper.appendChild(element);
    }
  }
  return toolbarUpper;
};
