'use strict';

import { queue } from '../CommandQueue.js';

class SettingController {

  constructor() {
    this.initialize();
  }

  back() {
    queue.publish('sidebar.change', 'none');
  }

  fontNext() {
    this.getNextFontIdx();
    queue.publish('font.change', this.fonts[this.fontIdx]);
  }

  fontPrev() {
    this.getPrevFontIdx();
    queue.publish('font.change', this.fonts[this.fontIdx]);
  }

  fontSize(fontSize) {
    queue.publish('font-size.change', fontSize);
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

  getDarkThemeIdx() {
    if (this.themes[this.themeIdx] === 'dark') {
      return this.themeIdx;
    }
    this.themeIdx = this.themes.findIndex((theme) => {
      return theme.themeType === 'dark' &&
        theme.themeName === this.theme.themeName;
    });
  }

  getLightThemeIdx() {
    if (this.themes[this.themeIdx] === 'light') {
      return this.themeIdx;
    }
    this.themeIdx = this.themes.findIndex((theme) => {
      return theme.themeType === 'light' &&
        theme.themeName === this.theme.themeName;
    });
  }

  getNextThemeIdx() {
    let nameIdx = this.themeNames.findIndex(x => x === this.theme.themeName);
    let nextNameIdx = nameIdx === this.maxThemeNamesIdx ? 0 : nameIdx += 1;
    this.themeIdx = this.themes.findIndex((theme) => {
      return theme.themeType === this.theme.themeType &&
        theme.themeName === this.themeNames[nextNameIdx];
    });
  }

  getPrevThemeIdx() {
    let nameIdx = this.themeNames.findIndex(x => x === this.theme.themeName);
    let nextNameIdx = nameIdx === 0 ? this.maxThemeNamesIdx : nameIdx -= 1;
    this.themeIdx = this.themes.findIndex((theme) => {
      return theme.themeType === this.theme.themeType &&
        theme.themeName === this.themeNames[nextNameIdx];
    });
  }

  initialize() {
    this.subscribe();
  }

  subscribe() {
    queue.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });

    queue.subscribe('fonts.update', (fonts) => {
      this.fontsUpdate(fonts);
    });

    queue.subscribe('setting.back', () => {
      this.back();
    });
    queue.subscribe('setting.font-next', () => {
      this.fontNext();
    });
    queue.subscribe('setting.font-prev', () => {
      this.fontPrev();
    });
    queue.subscribe('setting.font-size', (fontSize) => {
      this.fontSize(fontSize);
    });

    queue.subscribe('setting.theme-next', () => {
      this.themeNext();
    });
    queue.subscribe('setting.theme-prev', () => {
      this.themePrev();
    });

    queue.subscribe('setting.theme-dark', () => {
      this.themeDark();
    });
    queue.subscribe('setting.theme-light', () => {
      this.themeLight();
    });

    queue.subscribe('theme.update', (theme) => {
      this.themeUpdate(theme);
    });

    queue.subscribe('themes.update', (themes) => {
      this.themesUpdate(themes);
    });
  }

  themeDark() {
    let idxNow = this.themeIdx;
    this.getDarkThemeIdx();
    if (idxNow === this.themeIdx) {
      return;
    }
    queue.publish('theme.change', this.themes[this.themeIdx]);
  }

  themeLight() {
    let idxNow = this.themeIdx;
    this.getLightThemeIdx();
    if (idxNow === this.themeIdx) {
      return;
    }
    queue.publish('theme.change', this.themes[this.themeIdx]);
  }

  themeNext() {
    this.getNextThemeIdx();
    queue.publish('theme.change', this.themes[this.themeIdx]);
  }

  themePrev() {
    this.getPrevThemeIdx();
    queue.publish('theme.change', this.themes[this.themeIdx]);
  }

  themeUpdate(theme) {
    this.theme = theme;
    if (!this.themeIdx) {
      this.themeIdx = this.themes.findIndex((theme) => {
        return theme.themeType === this.theme.themeType &&
          theme.themeName === this.theme.themeName;
      });
    }
    if (!this.themeNameIdx) {
      this.themeNameIdx = this.themeNames.findIndex((theme) => {
        return theme.themeName === this.theme.themeName;
      });
    }
  }

  themesUpdate(themes) {
    this.themes = themes;
    this.maxThemesIdx = this.themes.length - 1;
    this.themeNames = [...new Set(this.themes.map(x => x.themeName))];
    this.maxThemeNamesIdx = this.themeNames.length - 1;
  }

}

export { SettingController };
