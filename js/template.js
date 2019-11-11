'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

export const templateActionMenu = (modifier, actionSet) => {
  let actionMenu = templateElement(
    'div', 'action-menu', modifier, null, null);
  actionMenu.classList.add('action-menu--hide');
  for (let btn of actionSet) {
    let element = templateBtnIcon(btn.icon, btn.label);
    actionMenu.appendChild(element);
  }
  return actionMenu;
};

export const templateBtnIcon = (svgId, label) => {
  let svgTag = document.createElementNS(svgNS, 'svg');
  svgTag.classList.add('icon-svg');
  let useTag = document.createElementNS(svgNS, 'use');
  useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
  svgTag.appendChild(useTag);
  let btnIcon = templateElement(
    'button', 'btn-icon', svgId, label, null);
  btnIcon.appendChild(svgTag);
  return btnIcon;
};

export const templateDivDialog = (modifier, toolSet) => {
  let divDialog = templateElement(
    'div', 'dialog', modifier, null, null);
  let divDialogBtns = templateElement(
    'div', 'dialog-btns', modifier, null, null);
  for (let tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = templateElement(
        'button', 'btn-dialog', tool.id, tool.label, tool.label);
      divDialogBtns.appendChild(element);
    } else if (tool.type === 'input') {
      element = templateInput('dialog-input', modifier, tool.label);
      divDialog.appendChild(element);
    } else if (tool.type === 'label') {
      element = templateElement(
        'div', 'dialog-label', modifier, null, null);
      if (tool.text) {
        element.textContent = tool.text;
      }
      divDialog.appendChild(element);
    } else if (tool.type === 'textarea') {
      element = templateElement(
        'textarea', 'dialog-textarea', modifier, tool.label, null);
      divDialog.appendChild(element);
    }
  }
  divDialog.appendChild(divDialogBtns);
  return divDialog;
};

export const templateElement = (tagName, block, modifier, label, content) => {
  let element = document.createElement(tagName);
  element.classList.add(block);
  if (modifier) {
    element.classList.add(`${block}--${modifier}`);
  }
  if (label) {
    element.setAttribute('aria-label', label);
  }
  if (content) {
    element.textContent = content;
  }
  return element;
};

export const templateInput = (block, modifier, label) => {
  let input = templateElement(
    'input', block, modifier, label, null);
  input.setAttribute('type', 'text');
  return input;
};

export const templatePage = (modifier) => {
  let page = templateElement(
    'div', 'page', modifier, null, null);
  page.classList.add('page--hide');
  return page;
};

export const templateScroll = (modifier) => {
  let scroll = templateElement(
    'div', 'scroll', modifier, null, null);
  return scroll;
};

export const templateToolbar = (modifier) => {
  let toolbar = templateElement(
    'div', 'toolbar', modifier, null, null);
  return toolbar;
};

export const templateToolbarLower = (toolSet) => {
  let toolbarLower = templateToolbar('lower');
  for (let tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = templateBtnIcon(tool.icon, tool.label);
      toolbarLower.appendChild(element);
    } else if (tool.type === 'input') {
      element = templateInput('input', tool.modifier, tool.label);
      toolbarLower.appendChild(element);
    }
  }
  return toolbarLower;
};

export const templateToolbarUpper = (toolSet) => {
  let toolbarUpper = templateToolbar('upper');
  for (let tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = templateBtnIcon(tool.icon, tool.label);
      toolbarUpper.appendChild(element);
    } else if (tool.type === 'banner') {
      element = templateElement(
        'div', 'banner', tool.modifier, null, tool.text);
      toolbarUpper.appendChild(element);
    }
  }
  return toolbarUpper;
};
