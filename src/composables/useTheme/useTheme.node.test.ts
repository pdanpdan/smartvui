// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { nextTick, ref } from 'vue';
import { useTheme, useThemeStyle } from '..';

describe('should return theme attribute', () => {
  const isDark = ref<boolean | null>(null);
  const theme = useTheme({ source: '#f8b200' });
  const { attrs } = useThemeStyle({ theme, isDark });

  it('should set theme `auto` on null', () => {
    expect(attrs.value).toEqual({ 'data-sv-theme': 'auto' });
  });

  it('should set theme `light` on false', async () => {
    isDark.value = false;
    await nextTick();
    expect(attrs.value).toEqual({ 'data-sv-theme': 'light' });
  });

  it('should set theme `dark` on true', async () => {
    isDark.value = true;
    await nextTick();
    expect(attrs.value).toEqual({ 'data-sv-theme': 'dark' });
  });
});

describe('should return theme CSS variables', () => {
  const isDark = ref<boolean | null>(null);
  const source = ref<string | number>('#f8b200');
  const format = ref<'hex' | 'rgb'>('hex');
  const customColors = ref([ { name: 'SmartVui', value: '#0d8fba', blend: true } ]);
  const theme = useTheme({ source, customColors });
  const { style } = useThemeStyle({
    theme,
    isDark,
    format,
    paletteTones: [ 10 ],
  });

  it('should return both themes on `auto`', () => {
    expect(style.value).toHaveProperty('--md-sys-color-primary-light', '#7b580d');
    expect(style.value).toHaveProperty('--md-sys-color-smartvui-light', '#006879');
    expect(style.value).toHaveProperty('--md-sys-color-primary-dark', '#eebf6d');
    expect(style.value).toHaveProperty('--md-sys-color-smartvui-dark', '#54d7f2');
    expect(Object.entries(style.value)).toHaveLength(113);
  });

  it('should return light theme on `light`', async () => {
    isDark.value = false;
    await nextTick();
    expect(style.value).toHaveProperty('--md-sys-color-primary', '#7b580d');
    expect(style.value).toHaveProperty('--md-sys-color-smartvui', '#006879');
    expect(style.value).not.toHaveProperty('--md-sys-color-primary-light');
    expect(style.value).not.toHaveProperty('--md-sys-color-primary-dark');
    expect(Object.entries(style.value)).toHaveLength(60);
  });

  it('should return dark theme on `dark`', async () => {
    isDark.value = true;
    await nextTick();
    expect(style.value).toHaveProperty('--md-sys-color-primary', '#eebf6d');
    expect(style.value).toHaveProperty('--md-sys-color-smartvui', '#54d7f2');
    expect(style.value).not.toHaveProperty('--md-sys-color-primary-light');
    expect(style.value).not.toHaveProperty('--md-sys-color-primary-dark');
    expect(Object.entries(style.value)).toHaveLength(60);
  });

  it('should accept source color as number', async () => {
    source.value = 4294488576;
    await nextTick();
    expect(style.value).toHaveProperty('--md-sys-color-primary', '#eebf6d');
    expect(style.value).toHaveProperty('--md-sys-color-smartvui', '#54d7f2');
  });

  it('should accept custom color as number', async () => {
    customColors.value = [ { name: 'SmartVui', value: 4279078842, blend: true } ] as unknown as typeof customColors.value;
    await nextTick();
    expect(style.value).toHaveProperty('--md-sys-color-smartvui', '#54d7f2');
  });

  it('should default to hex', async () => {
    const styleHex = useThemeStyle({ theme, isDark }).style;
    expect(styleHex.value).toHaveProperty('--md-sys-color-primary', '#eebf6d');
  });

  it('should generate palette tones', () => {
    expect(style.value).toHaveProperty('--md-ref-palette-primary10', '#271900');
    expect(style.value).toHaveProperty('--md-ref-palette-smartvui10', '#001f26');
  });

  it('should not generate palette tones by default', async () => {
    const stylePalette = useThemeStyle({ theme, isDark }).style;
    expect(stylePalette.value).not.toHaveProperty('--md-ref-palette-primary10');
    expect(Object.entries(stylePalette.value)).toHaveLength(53);
  });

  it('should filter using strings or regex list', () => {
    const styleFiltered = useThemeStyle({ theme, isDark, filter: [ 'primary', /smartvui/ ] }).style;
    expect(styleFiltered.value).not.toHaveProperty('--md-sys-color-secondary');
    expect(Object.entries(styleFiltered.value)).toHaveLength(13);
  });

  it('should filter using function', () => {
    const styleFiltered = useThemeStyle({ theme, isDark, filterFn: ([ key, _ ]: string[]) => key.includes('tertiary') !== true }).style;
    expect(styleFiltered.value).not.toHaveProperty('--md-sys-color-tertiary');
    expect(styleFiltered.value).toHaveProperty('--md-sys-color-secondary');
    expect(Object.entries(styleFiltered.value)).toHaveLength(45);
  });

  it('should change color', async () => {
    source.value = '#00f8b2';
    await nextTick();
    expect(style.value).toHaveProperty('--md-sys-color-primary', '#8dd5b2');
  });

  it('should return RGB color when requested', async () => {
    format.value = 'rgb';
    await nextTick();
    expect(style.value).toHaveProperty('--md-sys-color-primary', '141 213 178');
    expect(style.value).toHaveProperty('--md-sys-color-smartvui', '84 215 242');
  });

  it('should change custom colors', async () => {
    customColors.value = [];
    await nextTick();
    expect(style.value).not.toHaveProperty('--md-sys-color-smartvui');
  });

  it('should not generate custom colors when not needed', async () => {
    customColors.value = 'test' as unknown as typeof customColors.value;
    await nextTick();
    expect(style.value).not.toHaveProperty('--md-sys-color-smartvui');

    const themeNoCustom = useTheme({ source });
    expect(themeNoCustom.value.customColors).toEqual([]);
  });
});
