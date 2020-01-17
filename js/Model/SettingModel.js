'use strict';

import { bus } from '../EventBus.js';
import { appPrefix } from '../util.js';

const validFontSizes = ['font-size--s', 'font-size--m', 'font-size--l',
  'font-size--xl', 'font-size--xxl'
];

const fontDefault = 0;
const fontSizeDefault = 1;
const themeDefault = 1;

class SettingModel {

  constructor() {
    this.initialize();
  }

  fontChange(font) {
    this.font = font;
    this.saveFont();
    bus.publish('font.update', this.font);
  }

  fontIsValid(font) {
    let result;
    try {
      result = this.fonts.some((validFont) => {
        return validFont.fontName === font.fontName &&
          validFont.fontClass === font.fontClass;
      });
    } catch (error) {
      result = false;
    }
    return result;
  }

  fontSizeChange(fontSize) {
    this.fontSize = fontSize;
    this.saveFontSize();
    bus.publish('font-size.update', this.fontSize);
  }

  initialize() {
    this.subscribe();
  }

  initializeFonts() {
    this.fonts = [];
    this.fonts.push({
      fontName: 'Roboto',
      fontClass: 'font--roboto'
    });
    this.fonts.push({
      fontName: 'Open Sans',
      fontClass: 'font--open-sans'
    });
    this.fonts.push({
      fontName: 'Lato',
      fontClass: 'font--lato'
    });
    this.fonts.push({
      fontName: 'Roboto Slab',
      fontClass: 'font--roboto-slab'
    });
    this.fonts.push({
      fontName: 'Merriweather',
      fontClass: 'font--merriweather'
    });
    this.fonts.push({
      fontName: 'Playfair Display',
      fontClass: 'font--playfair-display'
    });
    bus.publish('fonts.update', this.fonts);
  }

  initializeThemes() {
    this.themes = [];
    this.themes.push({
      themeName: 'Jasper',
      themeClass: 'theme--jasper'
    });
    this.themes.push({
      themeName: 'Sapphire',
      themeClass: 'theme--sapphire'
    });
    this.themes.push({
      themeName: 'Chalcedony',
      themeClass: 'theme--chalcedony'
    });
    this.themes.push({
      themeName: 'Emerald',
      themeClass: 'theme--emerald'
    });
    this.themes.push({
      themeName: 'Beryl',
      themeClass: 'theme--beryl'
    });
    this.themes.push({
      themeName: 'Topaz',
      themeClass: 'theme--topaz'
    });
    this.themes.push({
      themeName: 'Amethyst',
      themeClass: 'theme--amethyst'
    });
    bus.publish('themes.update', this.themes);
  }

  restore() {
    this.initializeFonts();
    this.restoreFont();
    this.restoreFontSize();
    this.initializeThemes();
    this.restoreTheme();
  }

  restoreFont() {
    let defaultFont = this.fonts[fontDefault];
    let font = localStorage.getItem(`${appPrefix}-font`);
    if (!font) {
      font = defaultFont;
    } else {
      try {
        font = JSON.parse(font);
      } catch (error) {
        font = defaultFont;
      }
      if (!this.fontIsValid(font)) {
        font = defaultFont;
      }
    }
    this.fontChange(font);
  }

  restoreFontSize() {
    let defaultFontSize = validFontSizes[fontSizeDefault];
    let fontSize = localStorage.getItem(`${appPrefix}-fontSize`);
    if (!fontSize) {
      fontSize = defaultFontSize;
    } else {
      try {
        fontSize = JSON.parse(fontSize);
      } catch (error) {
        fontSize = defaultFontSize;
      }
      if (!validFontSizes.includes(fontSize)) {
        fontSize = defaultFontSize;
      }
    }
    this.fontSizeChange(fontSize);
  }

  restoreTheme() {
    let defaultTheme = this.themes[themeDefault];
    let theme = localStorage.getItem(`${appPrefix}-theme`);
    if (!theme) {
      theme = defaultTheme;
    } else {
      try {
        theme = JSON.parse(theme);
      } catch (error) {
        theme = defaultTheme;
      }
      if (!this.themeIsValid(theme)) {
        theme = defaultTheme;
      }
    }
    this.themeChange(theme);
  }

  saveFont() {
    localStorage.setItem(`${appPrefix}-font`, JSON.stringify(this.font));
  }

  saveFontSize() {
    localStorage.setItem(`${appPrefix}-fontSize`, JSON.stringify(this.fontSize));
  }

  saveTheme() {
    localStorage.setItem(`${appPrefix}-theme`, JSON.stringify(this.theme));
  }

  subscribe() {
    bus.subscribe('font.change', (font) => {
      this.fontChange(font);
    });

    bus.subscribe('font-size.change', (fontSize) => {
      this.fontSizeChange(fontSize);
    });

    bus.subscribe('setting.restore', () => {
      this.restore();
    });

    bus.subscribe('theme.change', (theme) => {
      this.themeChange(theme);
    });
  }

  themeChange(theme) {
    this.theme = theme;
    this.saveTheme();
    bus.publish('theme.update', this.theme);
  }

  themeIsValid(theme) {
    let result;
    try {
      result = this.themes.some((validTheme) => {
        return validTheme.themeName === theme.themeName &&
          validTheme.themeClass === theme.themeClass;
      });
    } catch (error) {
      result = false;
    }
    return result;
  }

}

export { SettingModel };
