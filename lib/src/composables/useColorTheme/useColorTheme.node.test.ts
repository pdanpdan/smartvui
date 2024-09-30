// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { useColorTheme, useColorThemeStyle } from '$lib/composables';

describe('useColorTheme [node]', () => {
  describe('color theme attributes', () => {
    const isDark = ref<boolean | null>(null);
    const colorTheme = useColorTheme({ source: '#f8b200' });
    const { attrs } = useColorThemeStyle({ colorTheme, isDark });

    it('should set color theme `auto` on null', () => {
      expect.soft(attrs.value).toEqual({ 'data-sv-color-scheme': 'auto' });
    });

    it('should set color theme `light` on false', () => {
      isDark.value = false;
      expect.soft(attrs.value).toEqual({ 'data-sv-color-scheme': 'light' });
    });

    it('should set color theme `dark` on true', () => {
      isDark.value = true;
      expect.soft(attrs.value).toEqual({ 'data-sv-color-scheme': 'dark' });
    });
  });

  describe('color theme CSS variables', () => {
    const isDark = ref<boolean | null>(true);
    const source = ref<string | number>('#f8b200');
    const format = ref<'hex' | 'rgb'>('hex');
    const customColors = ref([ { name: 'SmartVui', value: '#0d8fba', blend: true } ]);
    const colorTheme = useColorTheme({ source, customColors });
    const { style } = useColorThemeStyle({
      colorTheme,
      isDark,
      format,
      paletteTones: [ 10 ],
    });

    it('should return both color themes on `auto`', () => {
      isDark.value = null;
      expect.soft(style.value).toHaveProperty('--sv-sys-color-primary-light', '#7b580d');
      expect.soft(style.value).toHaveProperty('--sv-sys-color-smartvui-light', '#006879');
      expect.soft(style.value).toHaveProperty('--sv-sys-color-primary-dark', '#eebf6d');
      expect.soft(style.value).toHaveProperty('--sv-sys-color-smartvui-dark', '#54d7f2');
      expect.soft(Object.entries(style.value)).toHaveLength(113);
    });

    it('should return light color theme on `light`', () => {
      isDark.value = false;
      expect.soft(style.value).toHaveProperty('--sv-sys-color-primary', '#7b580d');
      expect.soft(style.value).toHaveProperty('--sv-sys-color-smartvui', '#006879');
      expect.soft(style.value).not.toHaveProperty('--sv-sys-color-primary-light');
      expect.soft(style.value).not.toHaveProperty('--sv-sys-color-primary-dark');
      expect.soft(Object.entries(style.value)).toHaveLength(60);
    });

    it('should return dark color theme on `dark`', () => {
      isDark.value = true;
      expect.soft(style.value).toHaveProperty('--sv-sys-color-primary', '#eebf6d');
      expect.soft(style.value).toHaveProperty('--sv-sys-color-smartvui', '#54d7f2');
      expect.soft(style.value).not.toHaveProperty('--sv-sys-color-primary-light');
      expect.soft(style.value).not.toHaveProperty('--sv-sys-color-primary-dark');
      expect.soft(Object.entries(style.value)).toHaveLength(60);
    });

    it('should accept source color as number', () => {
      source.value = 4294488576;
      expect.soft(style.value).toHaveProperty('--sv-sys-color-primary', '#eebf6d');
      expect.soft(style.value).toHaveProperty('--sv-sys-color-smartvui', '#54d7f2');
    });

    it('should accept custom color as number', () => {
      customColors.value = [ { name: 'SmartVui', value: 4279078842, blend: true } ] as unknown as typeof customColors.value;
      expect.soft(style.value).toHaveProperty('--sv-sys-color-smartvui', '#54d7f2');
    });

    it('should default to hex', () => {
      const styleHex = useColorThemeStyle({ colorTheme, isDark }).style;
      expect.soft(styleHex.value).toHaveProperty('--sv-sys-color-primary', '#eebf6d');
    });

    it('should generate palette tones', () => {
      expect.soft(style.value).toHaveProperty('--sv-ref-palette-primary10', '#271900');
      expect.soft(style.value).toHaveProperty('--sv-ref-palette-smartvui10', '#001f26');
    });

    it('should not generate palette tones by default', () => {
      const stylePalette = useColorThemeStyle({ colorTheme, isDark }).style;
      expect.soft(stylePalette.value).not.toHaveProperty('--sv-ref-palette-primary10');
      expect.soft(Object.entries(stylePalette.value)).toHaveLength(53);
    });

    it('should filter using strings or regex list', () => {
      const styleFiltered = useColorThemeStyle({ colorTheme, isDark, filter: [ 'primary', /smartvui/ ] }).style;
      expect.soft(styleFiltered.value).not.toHaveProperty('--sv-sys-color-secondary');
      expect.soft(Object.entries(styleFiltered.value)).toHaveLength(13);
    });

    it('should filter using function', () => {
      const styleFiltered = useColorThemeStyle({ colorTheme, isDark, filterFn: ([ key, _ ]: string[]) => key.includes('tertiary') !== true }).style;
      expect.soft(styleFiltered.value).not.toHaveProperty('--sv-sys-color-tertiary');
      expect.soft(styleFiltered.value).toHaveProperty('--sv-sys-color-secondary');
      expect.soft(Object.entries(styleFiltered.value)).toHaveLength(45);
    });

    it('should change color', () => {
      source.value = '#00f8b2';
      expect.soft(style.value).toHaveProperty('--sv-sys-color-primary', '#8dd5b2');
    });

    it('should return RGB color when requested', () => {
      format.value = 'rgb';
      source.value = '#00f8b2';
      expect.soft(style.value).toHaveProperty('--sv-sys-color-primary', '141 213 178');
      expect.soft(style.value).toHaveProperty('--sv-sys-color-smartvui', '84 215 242');
    });

    it('should change custom colors', () => {
      customColors.value = [];
      expect.soft(style.value).not.toHaveProperty('--sv-sys-color-smartvui');
    });

    it('should not generate custom colors when not needed', () => {
      customColors.value = 'test' as unknown as typeof customColors.value;
      expect.soft(style.value).not.toHaveProperty('--sv-sys-color-smartvui');

      const colorThemeNoCustom = useColorTheme({ source });
      expect.soft(colorThemeNoCustom.value.customColors).toEqual([]);
    });
  });
});
