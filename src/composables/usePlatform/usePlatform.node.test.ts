// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { renderToString } from '@vue/test-utils';

import { defineComponent, ref, toValue } from 'vue';
import type { MaybeRef } from 'vue';
import { usePlatform } from '..';
import type { UsePlatformResponse } from '..';

export const nullDefault = {
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

function stringify(obj: unknown): string {
  return JSON.stringify(obj, null, 2).replaceAll('"', '&quot;');
}

type UsePlatformKeys = keyof UsePlatformResponse;
function toObject(o: Record<UsePlatformKeys, MaybeRef<boolean | null>>) {
  return Object.keys(o).reduce((acc, k) => ({ ...acc, [ k as UsePlatformKeys ]: toValue(o[ k as UsePlatformKeys ]) }), {}) as Record<UsePlatformKeys, boolean | null>;
}

describe('should return value', () => {
  it('should return default values', () => {
    expect.soft(toObject(usePlatform())).toMatchObject(nullDefault);
  });

  it('should return forced fixed values', () => {
    expect.soft(toObject(usePlatform({ forceHasPointer: true }))).toMatchObject({ ...nullDefault, hasPointer: true, hasHover: true });
    expect.soft(toObject(usePlatform({ forceHasPointer: false }))).toMatchObject({ ...nullDefault, hasPointer: false, hasHover: false });

    expect.soft(toObject(usePlatform({ forceHasTouch: true }))).toMatchObject({ ...nullDefault, hasTouch: true });
    expect.soft(toObject(usePlatform({ forceHasTouch: false }))).toMatchObject({ ...nullDefault, hasTouch: false });

    expect.soft(toObject(usePlatform({ forceIsStandalone: true }))).toMatchObject({ ...nullDefault, isStandalone: true });
    expect.soft(toObject(usePlatform({ forceIsStandalone: false }))).toMatchObject({ ...nullDefault, isStandalone: false });

    expect.soft(toObject(usePlatform({ forceUserAgent: 'iPhone Macintosh' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'iPad Android' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'iPod Linux' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Macintosh Windows', forceHasTouch: true }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'iPhone Crios' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isChrome: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'iPhone Fxios' }))).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isFirefox: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Macintosh Cros Android Linux X11 Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isMacos: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Cros Android Linux X11 Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isChromeos: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Android Linux X11 Windows' }))).toMatchObject({ ...falseDefault, isMobile: true, isAndroid: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Linux Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'X11 Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Windows' }))).toMatchObject({ ...falseDefault, isDesktop: true, isWindows: true });

    expect.soft(toObject(usePlatform({ forceUserAgent: 'Firefox Chrome Safari' }))).toMatchObject({ ...falseDefault, isFirefox: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Chrome Safari' }))).toMatchObject({ ...falseDefault, isChrome: true });
    expect.soft(toObject(usePlatform({ forceUserAgent: 'Safari' }))).toMatchObject({ ...falseDefault, isSafari: true });
  });

  it('should return forced reactive value', () => {
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

    expect.soft(toObject(platform)).toMatchObject(nullDefault);

    forceHasPointer.value = true;
    expect.soft(toObject(platform)).toMatchObject({ ...nullDefault, hasPointer: true, hasHover: true });
    forceHasPointer.value = false;
    expect.soft(toObject(platform)).toMatchObject({ ...nullDefault, hasPointer: false, hasHover: false });
    forceHasPointer.value = null;

    forceHasTouch.value = true;
    expect.soft(toObject(platform)).toMatchObject({ ...nullDefault, hasTouch: true });
    forceHasTouch.value = false;
    expect.soft(toObject(platform)).toMatchObject({ ...nullDefault, hasTouch: false });
    forceHasTouch.value = null;

    forceIsStandalone.value = true;
    expect.soft(toObject(platform)).toMatchObject({ ...nullDefault, isStandalone: true });
    forceIsStandalone.value = false;
    expect.soft(toObject(platform)).toMatchObject({ ...nullDefault, isStandalone: false });
    forceIsStandalone.value = null;

    forceUserAgent.value = 'iPhone Macintosh';

    forceUserAgent.value = 'iPhone Macintosh';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true });
    forceUserAgent.value = 'iPad Android';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true });
    forceUserAgent.value = 'iPod Linux';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true });
    forceUserAgent.value = 'Macintosh Windows';
    forceHasTouch.value = true;
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isSafari: true, hasTouch: true });
    forceHasTouch.value = null;
    forceUserAgent.value = 'iPhone Crios';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isChrome: true });
    forceUserAgent.value = 'iPhone Fxios';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isMobile: true, isIos: true, isFirefox: true });
    forceUserAgent.value = 'Macintosh Cros Android Linux X11 Windows';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isMacos: true });
    forceUserAgent.value = 'Cros Android Linux X11 Windows';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isChromeos: true });
    forceUserAgent.value = 'Android Linux X11 Windows';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isMobile: true, isAndroid: true });
    forceUserAgent.value = 'Linux Windows';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
    forceUserAgent.value = 'X11 Windows';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isLinux: true });
    forceUserAgent.value = 'Windows';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isDesktop: true, isWindows: true });

    forceUserAgent.value = 'Firefox Chrome Safari';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isFirefox: true });
    forceUserAgent.value = 'Chrome Safari';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isChrome: true });
    forceUserAgent.value = 'Safari';
    expect.soft(toObject(platform)).toMatchObject({ ...falseDefault, isSafari: true });
  });

  it('should return forced value on SSR', async () => {
    expect.soft(await renderToString(defineComponent({
      template: '{{ platform }}',
      setup() {
        return { platform: usePlatform() };
      },
    }))).toBe(stringify(nullDefault));

    expect.soft(await renderToString(defineComponent({
      template: '{{ platform }}',
      setup() {
        return { platform: usePlatform({
          forceHasPointer: true,
        }) };
      },
    }))).toBe(stringify({ ...nullDefault, hasPointer: true, hasHover: true }));

    expect.soft(await renderToString(defineComponent({
      template: '{{ platform }}',
      setup() {
        return { platform: usePlatform({
          forceUserAgent: 'iPhone Macintosh',
        }) };
      },
    }))).toBe(stringify({ ...falseDefault, isMobile: true, isIos: true, isSafari: true }));
  });
});
