'use strict';

import { bus } from '../EventBus.js';

class SettingController {

  constructor() {
    this.initialize();
  }

  back() {
    bus.publish('sidebar.change', 'none');
  }

  fontNext() {
    this.getNextFontIdx();
    bus.publish('font.change', this.fonts[this.fontIdx]);
  }

  fontPrev() {
    this.getPrevFontIdx();
    bus.publish('font.change', this.fonts[this.fontIdx]);
  }

  fontSize(fontSize) {
    bus.publish('font-size.change', fontSize);
  }

  fontUpdate(font) {
    this.font = font;
    if (!this.fontIdx) {
      this.fontIdx = this.fonts.findIndex((font) => {
        return font.fontName === this.font.fontName;
      });
    }
  }

  fontsUpdate(fonts) {
    this.fonts = fonts;
    this.maxFontIdx = this.fonts.length - 1;
  }

  getNextFontIdx() {
    this.fontIdx = this.fontIdx === this.maxFontIdx ? 0 : this.fontIdx += 1;
  }

  getPrevFontIdx() {
    this.fontIdx = this.fontIdx === 0 ? this.maxFontIdx : this.fontIdx -= 1;
  }

  getNextThemeIdx() {
    this.themeIdx = this.themeIdx === this.maxThemeIdx ? 0 : this.themeIdx += 1;
  }

  getPrevThemeIdx() {
    this.themeIdx = this.themeIdx === 0 ? this.maxThemeIdx : this.themeIdx -= 1;
  }

  initialize() {
    this.subscribe();
  }

  subscribe() {
    bus.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });

    bus.subscribe('fonts.update', (fonts) => {
      this.fontsUpdate(fonts);
    });

    bus.subscribe('setting.back', () => {
      this.back();
    });
    bus.subscribe('setting.font-next', () => {
      this.fontNext();
    });
    bus.subscribe('setting.font-prev', () => {
      this.fontPrev();
    });
    bus.subscribe('setting.font-size', (fontSize) => {
      this.fontSize(fontSize);
    });

    bus.subscribe('setting.theme-next', () => {
      this.themeNext();
    });
    bus.subscribe('setting.theme-prev', () => {
      this.themePrev();
    });

    bus.subscribe('theme.update', (theme) => {
      this.themeUpdate(theme);
    });

    bus.subscribe('themes.update', (themes) => {
      this.themesUpdate(themes);
    });
  }

  themeNext() {
    this.getNextThemeIdx();
    bus.publish('theme.change', this.themes[this.themeIdx]);
  }

  themePrev() {
    this.getPrevThemeIdx();
    bus.publish('theme.change', this.themes[this.themeIdx]);
  }

  themeUpdate(theme) {
    this.theme = theme;
    if (!this.themeIdx) {
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeName === this.theme.themeName;
      });
    }
  }

  themesUpdate(themes) {
    this.themes = themes;
    this.maxThemeIdx = this.themes.length - 1;
  }

}

export { SettingController };
