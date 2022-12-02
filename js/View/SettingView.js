'use strict';

import {
  queue,
} from '../CommandQueue.js';
import {
  templateBtnIcon,
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper,
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'setting', text: 'Setting' },
];

const fontSize = [
  { size: 's', ariaLabel: 'Small' },
  { size: 'm', ariaLabel: 'Medium' },
  { size: 'l', ariaLabel: 'Large' },
  { size: 'xl', ariaLabel: 'Extra Large' },
  { size: 'xxl', ariaLabel: 'Extra Extra Large' },
];

const templateBtnFontSize = (size, label) => {
  let btnFontSize = templateElement(
    'button', 'btn-font-size', null, label, null);
  btnFontSize.textContent = 'Aa';
  btnFontSize.classList.add(`font-size--${size}`);
  btnFontSize.dataset.size = `font-size--${size}`;
  return btnFontSize;
};

const templateBtnThemeType = (type, label) => {
  let btnThemeType = templateElement(
    'button', 'btn-theme-type', null, label, null);
  btnThemeType.textContent = label;
  btnThemeType.classList.add(`theme-type--${type}`);
  btnThemeType.dataset.type = `${type}`;
  return btnThemeType;
};

const templateSettingFont = (modifier, name) => {
  let divSetting = templateElement(
    'div', 'setting', modifier, null, null);
  let heading = templateElement(
    'h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  let divCarousel = templateSettingCarousel('font', "Font");
  divSetting.appendChild(divCarousel);
  return divSetting;
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
  let divCarousel = templateElement(
    'div', 'carousel', modifier, null, null);
  let btnPrev = templateBtnIcon('prev', 'prev', `Previous ${name}`);
  let divName = templateElement(
    'div', 'name', modifier, null, null);
  let btnNext = templateBtnIcon('next', 'next', `Next ${name}`);
  divCarousel.appendChild(btnPrev);
  divCarousel.appendChild(divName);
  divCarousel.appendChild(btnNext);
  return divCarousel;
};

const templateSettingTheme = (modifier, name) => {
  let divSetting = templateElement(
    'div', 'setting', modifier, null, null);
  let heading = templateElement(
    'h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  let divSelector = templateElement(
    'div', 'selector', 'theme-type', null, null);
  let btnDark = templateBtnThemeType('dark', 'Dark');
  divSelector.appendChild(btnDark);
  let btnLight = templateBtnThemeType('light', 'Light');
  divSelector.appendChild(btnLight);
  divSetting.appendChild(divSelector);
  let divCarousel = templateSettingCarousel('theme', 'Theme');
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
      '<span class="font--bold">1 John 4:19 </span>' +
      'We love him, because he first loved us.</p>';
    this.scroll.appendChild(this.fontSample);

    this.divSettingFont = templateSettingFont('font', 'Font');
    this.scroll.appendChild(this.divSettingFont);

    this.divSettingFontSize = templateSettingFontSize('font-size', 'Font Size');
    this.scroll.appendChild(this.divSettingFontSize);

    this.divSettingTheme = templateSettingTheme('theme', 'Theme');
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
        queue.publish('setting.font-prev', null);
      } else if (btn === this.btnNextFont) {
        queue.publish('setting.font-next', null);
      }
    }
  }

  fontSizeClick(target) {
    let btn = target.closest('button');
    if (btn.classList.contains('btn-font-size')) {
      let dataSize = btn.dataset.size;
      queue.publish('setting.font-size', dataSize);
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
    
    this.divSelectorThemeType = this.divSettingTheme.querySelector('.selector--theme-type');
    this.btnDarkTheme = this.divSelectorThemeType.querySelector('.theme-type--dark');
    this.btnLightTheme = this.divSelectorThemeType.querySelector('.theme-type--light');
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

  scrollClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (this.divCarouselFont.contains(btn)) {
      this.fontClick(btn);
    } else if (this.divSelectorFontSize.contains(btn)) {
      this.fontSizeClick(btn);
    } else if (this.divSelectorThemeType.contains(btn)) {
      this.themeTypeClick(btn);
    } else if (this.divCarouselTheme.contains(btn)) {
      this.themeClick(btn);
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });

    queue.subscribe('font-size.update', (fontSize) => {
      this.fontSizeUpdate(fontSize);
    });

    queue.subscribe('setting.hide', () => {
      this.hide();
    });
    queue.subscribe('setting.show', () => {
      this.show();
    });

    queue.subscribe('theme.update', (theme) => {
      this.themeUpdate(theme);
    });
  }

  themeClick(target) {
    let btn = target.closest('button');
    if (btn) {
      if (btn === this.btnPrevTheme) {
        queue.publish('setting.theme-prev', null);
      } else if (btn === this.btnNextTheme) {
        queue.publish('setting.theme-next', null);
      }
    }
  }

  themeTypeClick(target) {
    let btn = target.closest('button');
    if (btn) {
      if (btn === this.btnDarkTheme) {
        queue.publish('setting.theme-dark', null);
      } else if (btn === this.btnLightTheme) {
        queue.publish('setting.theme-light', null);
      }
    }
  }

  themeUpdate(theme) {
    this.theme = theme;
    this.updateThemeName();
    this.updateThemeType();
    this.lastTheme = this.theme;
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('setting.back', null);
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

  updateThemeType() {
    if (this.activeThemeTypeBtn) {
      this.activeThemeTypeBtn.classList.remove('btn-theme-type--active');
    }
    this.activeThemeTypeBtn = this.divSelectorThemeType.querySelector(
      `button[data-type="${this.theme.themeType}"]`
    );
    this.activeThemeTypeBtn.classList.add('btn-theme-type--active');
  }

}

export { SettingView };
