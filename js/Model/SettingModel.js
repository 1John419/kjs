'use strict';

import { queue } from '../CommandQueue.js';

const validFontSizes = [
  'font-size--s', 'font-size--m', 'font-size--l', 'font-size--xl',
  'font-size--xxl',
];

const validFontVariants = [
  'normal', 'small-caps',
];

const fontDefault = 0;
const fontSizeDefault = 1;
const fontVariantDefault = 0;
const themeDefault = 9;

class SettingModel {

  constructor() {
    this.initialize();
  }

  fontChange(font) {
    this.font = font;
    this.saveFont();
    queue.publish('font.update', this.font);
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
    queue.publish('font-size.update', this.fontSize);
  }

  fontVariantChange(fontVariant) {
    this.fontVariant = fontVariant;
    this.saveFontVariant();
    queue.publish('font-variant.update', this.fontVariant);
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
      fontName: 'Roboto Slab',
      fontClass: 'font--roboto-slab'
    });
    this.fonts.push({
      fontName: 'Merriweather',
      fontClass: 'font--merriweather'
    });
    this.fonts.push({
      fontName: 'Courgette',
      fontClass: 'font--courgette'
    });
    this.fonts.push({
      fontName: 'Merienda',
      fontClass: 'font--merienda'
    });
    this.fonts.push({
      fontName: 'Roboto Mono',
      fontClass: 'font--roboto-mono'
    });
    this.fonts.push({
      fontName: 'Inconsolata',
      fontClass: 'font--inconsolata'
    });
    queue.publish('fonts.update', this.fonts);
  }

  initializeThemes() {
    this.themes = [];
    this.themes.push({
      themeType: 'dark',
      themeName: 'Jasper',
      themeClass: 'theme--jasper-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: 'Jasper',
      themeClass: 'theme--jasper-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: 'Beryl',
      themeClass: 'theme--beryl-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: 'Beryl',
      themeClass: 'theme--beryl-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: 'Emerald',
      themeClass: 'theme--emerald-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: 'Emerald',
      themeClass: 'theme--emerald-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: 'Topaz',
      themeClass: 'theme--topaz-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: 'Topaz',
      themeClass: 'theme--topaz-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: 'Sapphire',
      themeClass: 'theme--sapphire-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: 'Sapphire',
      themeClass: 'theme--sapphire-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: 'Amethyst',
      themeClass: 'theme--amethyst-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: 'Amethyst',
      themeClass: 'theme--amethyst-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: 'Chalcedony',
      themeClass: 'theme--chalcedony-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: 'Chalcedony',
      themeClass: 'theme--chalcedony-light'
    });
    queue.publish('themes.update', this.themes);
  }

  restore() {
    this.initializeFonts();
    this.restoreFont();
    this.restoreFontSize();
    this.restoreFontVariant();
    this.initializeThemes();
    this.restoreTheme();
  }

  restoreFont() {
    const defaultFont = this.fonts[fontDefault];
    let font = localStorage.getItem('font');
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
    const defaultFontSize = validFontSizes[fontSizeDefault];
    let fontSize = localStorage.getItem('fontSize');
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

  restoreFontVariant() {
    const defaultFontVariant = validFontVariants[fontVariantDefault];
    let fontVariant = localStorage.getItem('fontVariant');
    if (!fontVariant) {
      fontVariant = defaultFontVariant;
    } else {
      try {
        fontVariant = JSON.parse(fontVariant);
      } catch (error) {
        fontVariant = defaultFontVariant;
      }
      if (!validFontVariants.includes(fontVariant)) {
        fontVariant = defaultFontSize;
      }
    }
    this.fontVariantChange(fontVariant);
  }

  restoreTheme() {
    const defaultTheme = this.themes[themeDefault];
    let theme = localStorage.getItem('theme');
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
    localStorage.setItem('font', JSON.stringify(this.font));
  }

  saveFontSize() {
    localStorage.setItem('fontSize', JSON.stringify(this.fontSize));
  }

  saveFontVariant() {
    localStorage.setItem('fontVariant', JSON.stringify(this.fontVariant));
  }

  saveTheme() {
    localStorage.setItem('theme', JSON.stringify(this.theme));
  }

  subscribe() {
    queue.subscribe('font.change', (font) => {
      this.fontChange(font);
    });

    queue.subscribe('font-size.change', (fontSize) => {
      this.fontSizeChange(fontSize);
    });

    queue.subscribe('font-variant.change', (fontVariant) => {
      this.fontVariantChange(fontVariant);
    });

    queue.subscribe('setting.restore', () => {
      this.restore();
    });

    queue.subscribe('theme.change', (theme) => {
      this.themeChange(theme);
    });
  }

  themeChange(theme) {
    this.theme = theme;
    this.saveTheme();
    queue.publish('theme.update', this.theme);
  }

  themeIsValid(theme) {
    let result;
    try {
      result = this.themes.some((validTheme) => {
        return validTheme.themeType === theme.themeType &&
          validTheme.themeName === theme.themeName &&
          validTheme.themeClass === theme.themeClass;
      });
    } catch (error) {
      result = false;
    }
    return result;
  }

}

export { SettingModel };
