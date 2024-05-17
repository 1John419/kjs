'use strict';

import { tomeLists } from './data/tomeLists.js';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

export const template = {};

template.acrostic = (verseObj) => {
  let acrosticSpan = null;
  if (tomeLists.acrostics) {
    const acrostic = tomeLists.acrostics[verseObj.k];
    if (acrostic) {
      const glyph = acrostic.slice(0, 1);
      const xlit = acrostic.slice(1);
      const glyphSpan = template.element('span', 'font--hebrew', null, null, glyph);
      const xlitSpan = template.element('span', 'font--bold', null, null, xlit + ' ');
      acrosticSpan = document.createDocumentFragment();
      acrosticSpan.appendChild(glyphSpan);
      acrosticSpan.appendChild(xlitSpan);
    }
  }
  return acrosticSpan;
};

template.actionMenu = (cssModifier, actionSet) => {
  const actionMenu = template.element('div', 'action-menu', cssModifier, null, null);
  actionMenu.classList.add('hide');
  for (const btn of actionSet) {
    const element = template.btnIcon(btn.icon, btn.icon, null);
    actionMenu.appendChild(element);
  }
  return actionMenu;
};

template.btnBanner = (cssModifier, ariaLabel) => {
  const btnIcon = template.element('div', 'btn-banner', cssModifier, ariaLabel, null);
  return btnIcon;
};

template.btnIcon = (svgId, cssModifier, ariaLabel) => {
  const svgTag = document.createElementNS(svgNS, 'svg');
  svgTag.classList.add('icon-svg');
  const useTag = document.createElementNS(svgNS, 'use');
  useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
  svgTag.appendChild(useTag);
  const btnIcon = template.element('div', 'btn-icon', cssModifier, ariaLabel, null);
  btnIcon.appendChild(svgTag);
  return btnIcon;
};

template.divDialog = (cssModifier, toolSet) => {
  const divDialog = template.element('div', 'dialog', cssModifier, null, null);
  const divDialogBtns = template.element('div', 'dialog-btns', cssModifier, null, null);
  for (const tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = template.element('div', 'btn-dialog', tool.cssModifier, tool.ariaLabel, tool.label);
      divDialogBtns.appendChild(element);
    } else if (tool.type === 'input') {
      element = template.input('dialog-input', cssModifier, tool.ariaLabel);
      divDialog.appendChild(element);
    } else if (tool.type === 'label') {
      element = template.element('div', 'dialog-label', cssModifier, null, null);
      if (tool.text) {
        element.textContent = tool.text;
      }
      divDialog.appendChild(element);
    } else if (tool.type === 'textarea') {
      element = template.element('textarea', 'dialog-textarea', cssModifier, tool.ariaLabel, null);
      divDialog.appendChild(element);
    }
  }
  divDialog.appendChild(divDialogBtns);
  return divDialog;
};

template.element = (tagName, cssBlock, cssModifier, ariaLabel, textContent) => {
  const element = document.createElement(tagName);
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

template.input = (cssBlock, cssModifier, ariaLabel) => {
  const input = template.element('input', cssBlock, cssModifier, ariaLabel, null);
  input.setAttribute('type', 'text');
  return input;
};

template.page = (cssModifier) => {
  const page = template.element('div', 'page', cssModifier, null, null);
  page.classList.add('page--hide');
  return page;
};

template.scroll = (cssModifier) => {
  const scroll = template.element('div', 'scroll', cssModifier, null, null);
  return scroll;
};

template.strongList = (list, cssModifier) => {
  const strongList = template.element('ul', 'strong-def-list', cssModifier, null, null);
  for (const listItem of list) {
    const strongItem = template.element('li', 'list-item', null, null, null);
    const frags = listItem.split(/[HG]\d+/);
    const words = listItem.match(/[HG]\d+/g);
    if (words) {
      frags.map((value, index) => {
        const span = document.createElement('span');
        span.textContent = value;
        strongItem.appendChild(span);
        if (words[index]) {
          const num = words[index];
          const btn = template.element('div', 'btn-strong-def', null, null, num);
          btn.dataset.strongDef = num;
          strongItem.appendChild(btn);
        }
      });
    } else {
      strongItem.textContent = listItem;
    }
    strongList.appendChild(strongItem);
  }
  return strongList;
};

template.toolbar = (cssModifier) => {
  const toolbar = template.element('div', 'toolbar', cssModifier, null, null);
  return toolbar;
};

template.toolbarLower = (toolSet) => {
  const toolbarLower = template.toolbar('lower');
  for (const tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = template.btnIcon(tool.icon, tool.icon, tool.ariaLabel);
      toolbarLower.appendChild(element);
    } else if (tool.type === 'input') {
      element = template.input('input', tool.modifier, tool.ariaLabel);
      toolbarLower.appendChild(element);
    }
  }
  return toolbarLower;
};

template.toolbarMenu = (modifier, actionSet) => {
  const toolbarMenu = template.element('div', 'toolbar-menu', modifier, null, null);
  toolbarMenu.classList.add('toolbar-menu--hide');
  for (const btn of actionSet) {
    const element = template.btnIcon(btn.icon, `${modifier}-${btn.icon}`, btn.label);
    toolbarMenu.appendChild(element);
  }
  return toolbarMenu;
};

template.toolbarUpper = (toolSet) => {
  const toolbarUpper = template.toolbar('upper');
  for (const tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = template.btnIcon(tool.icon, tool.icon, tool.ariaLabel);
      toolbarUpper.appendChild(element);
    } else if (tool.type === 'btn-banner') {
      element = template.btnBanner(tool.cssModifier, tool.ariaLabel);
      toolbarUpper.appendChild(element);
    } else if (tool.type === 'banner') {
      element = template.element('div', 'banner', tool.cssModifier, null, tool.text);
      toolbarUpper.appendChild(element);
    }
  }
  return toolbarUpper;
};
