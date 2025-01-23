// @vitest-environment node

import { renderToString } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';

import { usePlatform } from '$lib/composables';
import { SmartVui } from '$lib/index';
import { deepUnref } from '$lib/test_utils/deepUnref';
import { stringifyHtml } from '$lib/test_utils/stringify';

describe('usePlatform [node]', () => {
  const nullDefault = {
    hasPointer: null,
    hasTouch: null,
    hasHover: null,
    isDesktop: null,
    isMobile: null,
    isStandalone: null,
    isEmulated: null,
    isAndroid: null,
    isIos: null,
    isLinux: null,
    isMacos: null,
    isWindows: null,
    isChromeos: null,
    isChrome: null,
    isFirefox: null,
    isSafari: null,
  };

  const falseDefault = {
    hasPointer: null,
    hasTouch: null,
    hasHover: null,
    isDesktop: false,
    isMobile: false,
    isStandalone: null,
    isEmulated: null,
    isAndroid: false,
    isIos: false,
    isLinux: false,
    isMacos: false,
    isWindows: false,
    isChromeos: false,
    isChrome: false,
    isFirefox: false,
    isSafari: false,
  };

  describe('in isolation', () => {
    it('should return default values', () => {
      expect.soft(deepUnref(usePlatform())).toMatchObject(nullDefault);
    });

    it('should return forced fixed values', () => {
      expect.soft(deepUnref(usePlatform({ forceHasPointer: true }))).toMatchObject({ ...nullDefault, hasPointer: true, hasHover: true });
      expect.soft(deepUnref(usePlatform({ forceHasPointer: false }))).toMatchObject({ ...nullDefault, hasPointer: false, hasHover: false });

      expect.soft(deepUnref(usePlatform({ forceHasTouch: true }))).toMatchObject({ ...nullDefault, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceHasTouch: false }))).toMatchObject({ ...nullDefault, hasTouch: false });

      expect.soft(deepUnref(usePlatform({ forceIsStandalone: true }))).toMatchObject({ ...nullDefault, isStandalone: true });
      expect.soft(deepUnref(usePlatform({ forceIsStandalone: false }))).toMatchObject({ ...nullDefault, isStandalone: false });

      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'iPhone Macintosh' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'iPad Android' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'iPod Linux' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Macintosh Windows', forceHasTouch: true }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'iPhone Crios' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isChrome: true, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'iPhone Fxios' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isFirefox: true, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Macintosh Cros Android Linux X11 Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isMacos: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Cros Android Linux X11 Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isChromeos: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Android Linux X11 Windows' }))).toMatchObject({ ...falseDefault, isMobile: true, isAndroid: true, hasTouch: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Linux Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'X11 Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isWindows: true });

      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Firefox Chrome Safari' }))).toMatchObject({ ...falseDefault, isFirefox: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Chrome Safari' }))).toMatchObject({ ...falseDefault, isChrome: true });
      expect.soft(deepUnref(usePlatform({ forceUserAgent: 'Safari' }))).toMatchObject({ ...falseDefault, isSafari: true });
    });

    it('should return forced reactive values', () => {
      const forceHasPointer = ref<boolean | null>(null);
      const forceHasTouch = ref<boolean | null>(null);
      const forceIsStandalone = ref<boolean | null>(null);
      const forceUserAgent = ref<string | null>(null);
      const platform = usePlatform({
        forceHasPointer,
        forceHasTouch,
        forceIsStandalone,
        forceUserAgent,
      });

      expect.soft(deepUnref(platform)).toMatchObject(nullDefault);

      forceHasPointer.value = true;
      expect.soft(deepUnref(platform)).toMatchObject({ ...nullDefault, hasPointer: true, hasHover: true });
      forceHasPointer.value = false;
      expect.soft(deepUnref(platform)).toMatchObject({ ...nullDefault, hasPointer: false, hasHover: false });
      forceHasPointer.value = null;

      forceHasTouch.value = true;
      expect.soft(deepUnref(platform)).toMatchObject({ ...nullDefault, hasTouch: true });
      forceHasTouch.value = false;
      expect.soft(deepUnref(platform)).toMatchObject({ ...nullDefault, hasTouch: false });
      forceHasTouch.value = null;

      forceIsStandalone.value = true;
      expect.soft(deepUnref(platform)).toMatchObject({ ...nullDefault, isStandalone: true });
      forceIsStandalone.value = false;
      expect.soft(deepUnref(platform)).toMatchObject({ ...nullDefault, isStandalone: false });
      forceIsStandalone.value = null;

      forceUserAgent.value = 'iPhone Macintosh';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      forceUserAgent.value = 'iPad Android';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      forceUserAgent.value = 'iPod Linux';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      forceUserAgent.value = 'Macintosh Windows';
      forceHasTouch.value = true;
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      forceHasTouch.value = null;
      forceUserAgent.value = 'iPhone Crios';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isChrome: true, hasTouch: true });
      forceUserAgent.value = 'iPhone Fxios';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isFirefox: true, hasTouch: true });
      forceUserAgent.value = 'Macintosh Cros Android Linux X11 Windows';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isMacos: true });
      forceUserAgent.value = 'Cros Android Linux X11 Windows';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isChromeos: true });
      forceUserAgent.value = 'Android Linux X11 Windows';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isMobile: true, isAndroid: true, hasTouch: true });
      forceUserAgent.value = 'Linux Windows';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
      forceUserAgent.value = 'X11 Windows';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
      forceUserAgent.value = 'Windows';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isWindows: true });

      forceUserAgent.value = 'Firefox Chrome Safari';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isFirefox: true });
      forceUserAgent.value = 'Chrome Safari';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isChrome: true });
      forceUserAgent.value = 'Safari';
      expect.soft(deepUnref(platform)).toMatchObject({ ...falseDefault, isSafari: true });
    });
  });

  describe('on SSR', () => {
    const Component = defineComponent({
      template: '{{ platform }}',
      props: [ 'defaults' ],
      setup(props) {
        return { platform: usePlatform(props.defaults) };
      },
    });

    const ParentComponent = defineComponent({
      template: `parent={{ platform }}|child1=<Component :defaults="defaultsChild1" />|child2=<Component :defaults="defaultsChild2" />`,
      props: [ 'defaults', 'defaultsChild1', 'defaultsChild2' ],
      setup(props) {
        return { platform: usePlatform(props.defaults) };
      },
    });

    const renderToStringOptions = {
      global: {
        plugins: [ [ SmartVui, { composables: [ usePlatform ] } ] ],
        components: { Component },
      },
    } as Parameters<typeof renderToString>[ 1 ];

    it('should return forced values', async () => {
      expect.soft(await renderToString(Component, renderToStringOptions)).toBe(stringifyHtml(nullDefault));

      expect.soft(await renderToString(Component, {
        props: { defaults: { forceHasPointer: true } },
        ...renderToStringOptions,
      })).toBe(stringifyHtml({ ...nullDefault, hasPointer: true, hasHover: true }));

      expect.soft(await renderToString(Component, {
        props: { defaults: { forceUserAgent: 'iPhone Macintosh' } },
        ...renderToStringOptions,
      })).toBe(stringifyHtml({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true }));
    });

    it('should reuse options if called from multiple components', async () => {
      const text = stringifyHtml({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      expect.soft(await renderToString(ParentComponent, {
        props: { defaults: { forceUserAgent: 'iPhone Macintosh' } },
        ...renderToStringOptions,
      })).toContain(`parent=${ text }|child1=${ text }|child2=${ text }`);

      expect.soft(await renderToString(ParentComponent, {
        props: {
          defaults: { forceUserAgent: 'iPhone Macintosh' },
          defaultsChild1: { forceHasPointer: true },
          defaultsChild2: { forceTouch: true },
        },
        ...renderToStringOptions,
      })).toContain(`parent=${ text }|child1=${ text }|child2=${ text }`);

      const textNull = stringifyHtml(nullDefault);
      expect.soft(await renderToString(ParentComponent, {
        props: {
          defaultsChild1: { forceUserAgent: 'iPhone Macintosh' },
          defaultsChild2: { forceHasPointer: true },
        },
        ...renderToStringOptions,
      })).toContain(`parent=${ textNull }|child1=${ text }|child2=${ text }`);
    });

    it('should not reuse options if called from multiple apps', async () => {
      const text1 = stringifyHtml({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
      expect.soft(await renderToString(ParentComponent, {
        props: { defaults: { forceUserAgent: 'iPhone Macintosh' } },
        ...renderToStringOptions,
      })).toContain(`parent=${ text1 }|child1=${ text1 }|child2=${ text1 }`);

      const text2 = stringifyHtml(nullDefault);
      expect.soft(await renderToString(ParentComponent, {
        ...renderToStringOptions,
      })).toContain(`parent=${ text2 }|child1=${ text2 }|child2=${ text2 }`);
    });

    it('should not warn if installed', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      await renderToString(Component, renderToStringOptions);
      expect.soft(consoleWarnSpy).not.toHaveBeenCalled();
      vi.restoreAllMocks();
    });

    it('should warn if not installed', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      await renderToString(Component);
      expect.soft(consoleWarnSpy).toHaveBeenCalledWith('[ SmartVui ] usePlatform was not installed. It will not work as a singleton.');
      vi.restoreAllMocks();
    });
  });
});
