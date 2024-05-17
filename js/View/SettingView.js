'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'setting', text: 'Setting' },
];

const fontSize = [
  { size: 's', ariaLabel: null },
  { size: 'm', ariaLabel: null },
  { size: 'l', ariaLabel: null },
  { size: 'xl', ariaLabel: null },
  { size: 'xxl', ariaLabel: null },
];

const fontVariant = [
  { variant: 'normal', ariaLabel: null },
  { variant: 'small-caps', ariaLabel: null },
];

const templateBtnFontSize = (size, label) => {
  const btnFontSize = template.element('div', 'btn-font-size', null, null, null);
  btnFontSize.textContent = 'Aa';
  btnFontSize.classList.add(`font-size--${size}`);
  btnFontSize.dataset.size = `font-size--${size}`;
  return btnFontSize;
};

const templateBtnFontVariant = (variant, label) => {
  const btnFontVariant = template.element('div', 'btn-font-variant', null, null, null);
  btnFontVariant.textContent = label;
  btnFontVariant.classList.add(`${variant}`);
  btnFontVariant.dataset.variant = `${variant}`;
  return btnFontVariant;
};

const templateBtnThemeType = (type, label) => {
  const btnThemeType = template.element('div', 'btn-theme-type', null, null, null);
  btnThemeType.textContent = label;
  btnThemeType.classList.add(`theme-type--${type}`);
  btnThemeType.dataset.type = `${type}`;
  return btnThemeType;
};

const templateSettingFont = (modifier, name) => {
  const divSetting = template.element('div', 'setting', modifier, null, null);
  const heading = template.element('h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  const divCarousel = templateSettingCarousel('font', 'Font');
  divSetting.appendChild(divCarousel);
  return divSetting;
};

const templateSettingFontSize = (modifier, name) => {
  const divSetting = template.element('div', 'setting', modifier, null, null);
  const heading = template.element('h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  const divSelector = template.element('div', 'selector', 'font-size', null, null);
  for (const size of fontSize) {
    const btn = templateBtnFontSize(size.size, size.label);
    divSelector.appendChild(btn);
  }
  divSetting.appendChild(divSelector);
  return divSetting;
};

const templateSettingFontVariant = (modifier, name) => {
  const divSetting = template.element('div', 'setting', modifier, null, null);
  const heading = template.element('h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  const divSelector = template.element('div', 'selector', 'font-variant', null, null);
  const btnNormal = templateBtnFontVariant('normal', 'Normal');
  divSelector.appendChild(btnNormal);
  const btnSmallCaps = templateBtnFontVariant('small-caps', 'Small Caps');
  divSelector.appendChild(btnSmallCaps);
  divSetting.appendChild(divSelector);
  return divSetting;
};

const templateSettingCarousel = (modifier, name) => {
  const divCarousel = template.element('div', 'carousel', modifier, null, null);
  const btnPrev = template.btnIcon('prev', 'prev', null);
  const divName = template.element('div', 'name', modifier, null, null);
  const btnNext = template.btnIcon('next', 'next', null);
  divCarousel.appendChild(btnPrev);
  divCarousel.appendChild(divName);
  divCarousel.appendChild(btnNext);
  return divCarousel;
};

const templateSettingTheme = (modifier, name) => {
  const divSetting = template.element('div', 'setting', modifier, null, null);
  const heading = template.element('h1', 'header', modifier, null, name);
  divSetting.appendChild(heading);
  const divSelector = template.element('div', 'selector', 'theme-type', null, null);
  const btnDark = templateBtnThemeType('dark', 'Dark');
  divSelector.appendChild(btnDark);
  const btnLight = templateBtnThemeType('light', 'Light');
  divSelector.appendChild(btnLight);
  divSetting.appendChild(divSelector);
  const divCarousel = templateSettingCarousel('theme', 'Theme');
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
    this.page = template.page('setting');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('setting');

    this.fontSample = template.element('div', 'font-sample', null, null, null);
    this.fontSample.innerHTML = '<p class="font-sample-verse">' +
      '<span class="font--bold">1 John 4:19 </span>' +
      'We love him, because he first loved us.</p>';
    this.scroll.appendChild(this.fontSample);

    this.divSettingFont = templateSettingFont('font', 'Font');
    this.scroll.appendChild(this.divSettingFont);

    this.divSettingFontSize = templateSettingFontSize('font-size', 'Font Size');
    this.scroll.appendChild(this.divSettingFontSize);

    this.divSettingFontVariant = templateSettingFontVariant('font-variant', 'Font Variant');
    this.scroll.appendChild(this.divSettingFontVariant);

    this.divSettingTheme = templateSettingTheme('theme', 'Theme');
    this.scroll.appendChild(this.divSettingTheme);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  fontClick(target) {
    const btn = target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnPrevFont) {
        queue.publish('setting.font-prev', null);
      } else if (btn === this.btnNextFont) {
        queue.publish('setting.font-next', null);
      }
    }
  }

  fontSizeClick(target) {
    const btn = target.closest('div.btn-font-size');
    if (btn) {
      if (btn.classList.contains('btn-font-size')) {
        const dataSize = btn.dataset.size;
        queue.publish('setting.font-size', dataSize);
      }
    }
  }

  fontVariantClick(target) {
    const btn = target.closest('div.btn-font-variant');
    if (btn) {
      if (btn.classList.contains('btn-font-variant')) {
        const dataVariant = btn.dataset.variant;
        queue.publish('setting.font-variant', dataVariant);
      }
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

  fontVariantUpdate(fontVariant) {
    this.fontVariant = fontVariant;
    this.updateFontVariantBtn();
    this.updateFontVariant();
    this.lastFontVariant = this.fontVariant;
  }

  getElements() {
    this.divCarouselFont = this.divSettingFont.querySelector('.carousel--font');
    this.btnPrevFont = this.divCarouselFont.querySelector('.btn-icon--prev');
    this.divNameFont = this.divCarouselFont.querySelector('.name--font');
    this.btnNextFont = this.divCarouselFont.querySelector('.btn-icon--next');

    this.divSelectorFontSize = this.divSettingFontSize.querySelector('.selector--font-size');
    this.divSelectorFontVariant = this.divSettingFontVariant.querySelector('.selector--font-variant');

    this.divSelectorThemeType = this.divSettingTheme.querySelector('.selector--theme-type');
    this.btnDarkTheme = this.divSelectorThemeType.querySelector('.theme-type--dark');
    this.btnLightTheme = this.divSelectorThemeType.querySelector('.theme-type--light');
    this.divCarouselTheme = this.divSettingTheme.querySelector('.carousel--theme');
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
    this.lastFontVariant = null;
    this.lastTheme = null;
  }

  scrollClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div');
    if (btn) {
      if (this.divCarouselFont.contains(btn)) {
        this.fontClick(btn);
      } else if (this.divSelectorFontSize.contains(btn)) {
        this.fontSizeClick(btn);
      } else if (this.divSelectorFontVariant.contains(btn)) {
        this.fontVariantClick(btn);
      } else if (this.divSelectorThemeType.contains(btn)) {
        this.themeTypeClick(btn);
      } else if (this.divCarouselTheme.contains(btn)) {
        this.themeClick(btn);
      }
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

    queue.subscribe('font-variant.update', (fontVariant) => {
      this.fontVariantUpdate(fontVariant);
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
    const btn = target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnPrevTheme) {
        queue.publish('setting.theme-prev', null);
      } else if (btn === this.btnNextTheme) {
        queue.publish('setting.theme-next', null);
      }
    }
  }

  themeTypeClick(target) {
    const btn = target.closest('div.btn-theme-type');
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
    const btn = event.target.closest('div.btn-icon');
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
    this.activeFontSizeBtn = this.divSelectorFontSize.querySelector(`div[data-size="${this.fontSize}"]`);
    this.activeFontSizeBtn.classList.add('btn-font-size--active');
  }

  updateFontVariant() {
    if (this.lastFontVariant) {
      this.fontSample.classList.remove(this.lastFontVariant);
      this.divSelectorFontSize.classList.remove(this.lastFontVariant);
    }
    this.fontSample.classList.add(this.fontVariant);
    this.divSelectorFontSize.classList.add(this.fontVariant);
  }

  updateFontVariantBtn() {
    if (this.activeFontVariantBtn) {
      this.activeFontVariantBtn.classList.remove('btn-font-variant--active');
    }
    this.activeFontVariantBtn = this.divSelectorFontVariant.querySelector(`div[data-variant="${this.fontVariant}"]`);
    this.activeFontVariantBtn.classList.add('btn-font-variant--active');
  }

  updateThemeName() {
    this.divNameTheme.innerText = this.theme.themeName;
  }

  updateThemeType() {
    if (this.activeThemeTypeBtn) {
      this.activeThemeTypeBtn.classList.remove('btn-theme-type--active');
    }
    this.activeThemeTypeBtn = this.divSelectorThemeType.querySelector(`div[data-type="${this.theme.themeType}"]`);
    this.activeThemeTypeBtn.classList.add('btn-theme-type--active');
  }

}

export { SettingView };
