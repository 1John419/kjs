'use strict';

import { bus } from '../EventBus.js';
import {
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'setting', text: 'Setting' }
];

const fontSize = [
  { size: 's', label: 'Small' },
  { size: 'm', label: 'Medium' },
  { size: 'l', label: 'Large' },
  { size: 'xl', label: 'Extra Large' },
  { size: 'xxl', label: 'Extra Extra Large' }
];

const templateBtnFontSize = (size, label) => {
  let btnFontSize = templateElement(
    'button', 'btn-font-size', null, label, null);
  btnFontSize.textContent = 'Aa';
  btnFontSize.classList.add(`font-size--${size}`);
  btnFontSize.dataset.size = `font-size--${size}`;
  return btnFontSize;
};

const templateSettingFontSize = (modifier, name) => {
  let divSetting = templateElement(
    'div', 'setting', modifier, null, null);
  let heading = templateElement(
    'h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  let divSelector = templateElement(
    'div', 'selector', 'font-size', null, null);
  for (let size of fontSize) {
    let btn = templateBtnFontSize(size.size, size.label);
    divSelector.appendChild(btn);
  }
  divSetting.appendChild(divSelector);
  return divSetting;
};

const templateSettingCarousel = (modifier, name) => {
  let divSetting = templateElement(
    'div', 'setting', modifier, null, null);
  let heading = templateElement(
    'h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  let divCarousel = templateElement(
    'div', 'carousel', modifier, null, null);
  let btnPrev = templateBtnIcon('prev', `Previous ${name}`);
  let divName = templateElement(
    'div', 'name', modifier, null, null);
  let btnNext = templateBtnIcon('next', `Next ${name}`);
  divCarousel.appendChild(btnPrev);
  divCarousel.appendChild(divName);
  divCarousel.appendChild(btnNext);
  divSetting.appendChild(divCarousel);
  return divSetting;
};

class SettingView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.scroll.addEventListener('click', (event) => {
      this.scrollClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('setting');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('setting');

    this.fontSample = templateElement('div', 'font-sample', null, null, null);
    this.fontSample.innerHTML = '<p class="font-sample-verse">' +
      '<span class="verse-ref">1 John 4:19</span>' +
      'We love him, because he first loved us.</p>';
    this.scroll.appendChild(this.fontSample);

    this.divSettingFont = templateSettingCarousel('font', 'Font');
    this.scroll.appendChild(this.divSettingFont);

    this.divSettingFontSize = templateSettingFontSize('font-size', 'Font Size');
    this.scroll.appendChild(this.divSettingFontSize);

    this.divSettingTheme = templateSettingCarousel('theme', 'Theme');
    this.scroll.appendChild(this.divSettingTheme);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  fontClick(target) {
    let btn = target.closest('button');
    if (btn) {
      if (btn === this.btnPrevFont) {
        bus.publish('setting.font-prev', null);
      } else if (btn === this.btnNextFont) {
        bus.publish('setting.font-next', null);
      }
    }
  }

  fontSizeClick(target) {
    let btn = target.closest('button');
    if (btn.classList.contains('btn-font-size')) {
      let dataSize = btn.dataset.size;
      bus.publish('setting.font-size', dataSize);
    }
  }

  fontSizeUpdate(fontSize) {
    this.fontSize = fontSize;
    this.updateFontSizeBtn();
    this.updateFontSize();
    this.lastFontSize = this.fontSize;
  }

  fontUpdate(font) {
    this.font = font;
    this.updateFontName();
    this.updateFont();
    this.lastFont = this.font;
  }

  getElements() {
    this.divCarouselFont = this.divSettingFont.querySelector('.carousel--font');
    this.btnPrevFont = this.divCarouselFont.querySelector('.btn-icon--prev');
    this.divNameFont = this.divCarouselFont.querySelector('.name--font');
    this.btnNextFont = this.divCarouselFont.querySelector('.btn-icon--next');

    this.divSelectorFontSize = this.divSettingFontSize.querySelector('.selector--font-size');

    this.divCarouselTheme = this.divSettingTheme.querySelector(
      '.carousel--theme');
    this.btnPrevTheme = this.divCarouselTheme.querySelector('.btn-icon--prev');
    this.divNameTheme = this.divCarouselTheme.querySelector('.name--theme');
    this.btnNextTheme = this.divCarouselTheme.querySelector('.btn-icon--next');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
    this.lastTheme = null;
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  scrollClick(event) {
    event.preventDefault();
    let target = event.target;
    if (this.divCarouselFont.contains(target)) {
      this.fontClick(target);
    } else if (this.divSelectorFontSize.contains(target)) {
      this.fontSizeClick(target);
    } else if (this.divCarouselTheme.contains(target)) {
      this.themeClick(target);
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    bus.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });

    bus.subscribe('font-size.update', (fontSize) => {
      this.fontSizeUpdate(fontSize);
    });

    bus.subscribe('setting.hide', () => {
      this.hide();
    });
    bus.subscribe('setting.show', () => {
      this.show();
    });

    bus.subscribe('theme.update', (theme) => {
      this.themeUpdate(theme);
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  themeClick(target) {
    let btn = target.closest('button');
    if (btn) {
      if (btn === this.btnPrevTheme) {
        bus.publish('setting.theme-prev', null);
      } else if (btn === this.btnNextTheme) {
        bus.publish('setting.theme-next', null);
      }
    }
  }

  themeUpdate(theme) {
    this.theme = theme;
    this.updateThemeName();
    this.lastTheme = this.theme;
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        bus.publish('setting.back', null);
      }
    }
  }

  updateFont() {
    if (this.lastFont) {
      this.divCarouselFont.classList.remove(this.lastFont.fontClass);
      this.divSelectorFontSize.classList.remove(this.lastFont.fontClass);
      this.fontSample.classList.remove(this.lastFont.fontClass);
    }
    this.divCarouselFont.classList.add(this.font.fontClass);
    this.divSelectorFontSize.classList.add(this.font.fontClass);
    this.fontSample.classList.add(this.font.fontClass);
  }

  updateFontName() {
    this.divNameFont.innerText = this.font.fontName;
    this.updateFont(this.fontName);
  }

  updateFontSize() {
    if (this.lastFontSize) {
      this.fontSample.classList.remove(this.lastFontSize);
    }
    this.fontSample.classList.add(this.fontSize);
  }

  updateFontSizeBtn() {
    if (this.activeFontSizeBtn) {
      this.activeFontSizeBtn.classList.remove('btn-font-size--active');
    }
    this.activeFontSizeBtn = this.divSelectorFontSize.querySelector(
      `button[data-size="${this.fontSize}"]`
    );
    this.activeFontSizeBtn.classList.add('btn-font-size--active');
  }

  updateThemeName() {
    this.divNameTheme.innerText = this.theme.themeName;
  }

}

export { SettingView };
