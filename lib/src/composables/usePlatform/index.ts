import type {
  App,
  ComputedRef,
  MaybeRefOrGetter,
} from 'vue';

import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  reactive,
  toValue,
} from 'vue';

import { createInjectedOptions, useInjectedOptions } from '$lib/utils/injectedOptions';

type platformKey = string & (
  'hasPointer' | 'hasTouch' | 'hasHover'
  | 'isDesktop' | 'isMobile'
  | 'isStandalone' | 'isEmulated'
  | 'isAndroid' | 'isIos' | 'isLinux' | 'isMacos' | 'isWindows' | 'isChromeos'
  | 'isChrome' | 'isFirefox' | 'isSafari'
);

const platformStateDefaults: Record<platformKey, boolean | null> = {
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
const platformState = reactive<Record<platformKey, boolean | null>>({ ...platformStateDefaults });
function updatePointerFine(evt: MediaQueryListEvent) {
  platformState.hasPointer = evt.matches;
}
function updatePointerCoarse(evt: MediaQueryListEvent) {
  platformState.hasTouch = evt.matches;
}
function updatePointerHover(evt: MediaQueryListEvent) {
  platformState.hasHover = evt.matches;
}
function updatePointerNone(evt: MediaQueryListEvent) {
  if (evt.matches) {
    platformState.hasPointer = false;
    platformState.hasTouch = false;
    platformState.hasHover = false;
  }
}
function updateModeStandalone(evt: MediaQueryListEvent) {
  platformState.isStandalone = evt.matches;
}

let mountedCount = 0;
let mediaPointerFine: MediaQueryList;
let mediaPointerCoarse: MediaQueryList;
let mediaPointerNone: MediaQueryList;
let mediaPointerHover: MediaQueryList;
let mediaModeStandalone: MediaQueryList;

function parseUserAgent(
  userAgent: string,
  hasTouch: boolean | null,
  vendor?: string,
  maxTouchPoints?: number,
  userAgentData?: unknown,
) {
  const agentPlatform = {
    isDesktop: false,
    isMobile: false,

    isEmulated: false,

    isAndroid: false,
    isIos: false,
    isLinux: false,
    isMacos: false,
    isWindows: false,
    isChromeos: false,

    isChrome: false,
    isFirefox: false,
    isSafari: false,
  } as Record<platformKey, boolean>;

  if (/firefox|fxios/i.test(userAgent)) {
    agentPlatform.isFirefox = true;
  } else if (/chrom|crios/i.test(userAgent) || userAgentData != null) {
    agentPlatform.isChrome = true;
  } else if (/safari/i.test(userAgent)) {
    agentPlatform.isSafari = true;
  }

  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && hasTouch === true)) {
    agentPlatform.isIos = true;
    agentPlatform.isMobile = true;
    agentPlatform.hasTouch = true;

    if (!agentPlatform.isFirefox && !agentPlatform.isChrome && !agentPlatform.isSafari) {
      agentPlatform.isSafari = true;
    }

    if ((vendor != null && /apple/i.test(vendor) === false) || maxTouchPoints === 0 || maxTouchPoints === 1) {
      agentPlatform.isEmulated = true;
    }
  } else if (/macintosh/i.test(userAgent)) {
    agentPlatform.isMacos = true;
    agentPlatform.isDesktop = true;
  } else if (/cros/i.test(userAgent)) {
    agentPlatform.isChromeos = true;
    agentPlatform.isDesktop = true;
  } else if (/android/i.test(userAgent)) {
    agentPlatform.isAndroid = true;
    agentPlatform.isMobile = true;
    agentPlatform.hasTouch = true;

    if (maxTouchPoints === 0 || maxTouchPoints === 1) {
      agentPlatform.isEmulated = true;
    }
  } else if (/linux|x11/i.test(userAgent)) {
    agentPlatform.isLinux = true;
    agentPlatform.isDesktop = true;
  } else if (/windows/i.test(userAgent)) {
    agentPlatform.isWindows = true;
    agentPlatform.isDesktop = true;
  }

  return agentPlatform;
}

/**
 * Options for `usePlatform`.
 *
 * @public
 */
export interface UsePlatformOptions {
  /** Forced hasPointer. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceHasPointer?: MaybeRefOrGetter<boolean | null>;
  /** Forced hasTouch. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceHasTouch?: MaybeRefOrGetter<boolean | null>;
  /** Forced isStandalone. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceIsStandalone?: MaybeRefOrGetter<boolean | null>;
  /** Forced UserAgent. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceUserAgent?: MaybeRefOrGetter<string | null>;
}

/**
 * Returned object from `usePlatform`.
 *
 * @public
 */
export interface UsePlatformReturn {
  /** Platform has fine pointer (mouse). Reactive, returns `null` when not yet detected (on server side or before hydration). */
  hasPointer: ComputedRef<boolean | null>;
  /** Platform has coarse pointer (touch). Reactive, returns `null` when not yet detected (on server side or before hydration). */
  hasTouch: ComputedRef<boolean | null>;
  /** Platform has hover. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  hasHover: ComputedRef<boolean | null>;
  /** Platform is desktop. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isDesktop: ComputedRef<boolean | null>;
  /** Platform is mobile. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isMobile: ComputedRef<boolean | null>;
  /** Platform is standalone (installed PWA). Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isStandalone: ComputedRef<boolean | null>;
  /** Platform is emulated (chrome dev tools). Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isEmulated: ComputedRef<boolean | null>;
  /** Platform OS is Android. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isAndroid: ComputedRef<boolean | null>;
  /** Platform OS is iOS. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isIos: ComputedRef<boolean | null>;
  /** Platform OS is Linux like. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isLinux: ComputedRef<boolean | null>;
  /** Platform OS is MacOS. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isMacos: ComputedRef<boolean | null>;
  /** Platform OS is Windows. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isWindows: ComputedRef<boolean | null>;
  /** Platform OS is ChromeOS. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isChromeos: ComputedRef<boolean | null>;
  /** Platform browser is Chrome like. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isChrome: ComputedRef<boolean | null>;
  /** Platform browser is Firefox. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isFirefox: ComputedRef<boolean | null>;
  /** Platform browser is Safari. Reactive, returns `null` when not yet detected (on server side or before hydration). */
  isSafari: ComputedRef<boolean | null>;
}

const { injectionKey, getInjectedOptionsRef } = createInjectedOptions<UsePlatformOptions>('usePlatform');

function executeWhenMounted() {
  mountedCount += 1;

  if (mountedCount === 1) {
    mediaPointerFine = matchMedia('screen and (any-pointer: fine)');
    mediaPointerFine.addEventListener('change', updatePointerFine);
    platformState.hasPointer = mediaPointerFine.matches;

    mediaPointerCoarse = matchMedia('screen and (any-pointer: coarse)');
    mediaPointerCoarse.addEventListener('change', updatePointerCoarse);
    platformState.hasTouch = mediaPointerCoarse.matches;

    mediaPointerNone = matchMedia('screen and (any-pointer: none)');
    mediaPointerNone.addEventListener('change', updatePointerNone);
    if (mediaPointerNone.matches) {
      platformState.hasPointer = false;
      platformState.hasTouch = false;
      platformState.hasHover = false;
    }

    mediaPointerHover = matchMedia('screen and (any-hover: hover)');
    mediaPointerHover.addEventListener('change', updatePointerHover);
    platformState.hasHover = mediaPointerHover.matches;

    mediaModeStandalone = matchMedia('screen and (display-mode: standalone)');
    mediaModeStandalone.addEventListener('change', updateModeStandalone);
    platformState.isStandalone = mediaModeStandalone.matches || (window.navigator && (window.navigator as unknown as Record<string, unknown>).standalone === true);

    Object.assign(platformState, parseUserAgent(
      navigator.userAgent,
      platformState.hasTouch,
      navigator.vendor,
      navigator.maxTouchPoints,
      (navigator as unknown as Record<string, unknown>).userAgentData,
    ));
  }
}

function executeWhenUnmounted() {
  mountedCount -= 1;

  if (mountedCount <= 0) {
    mountedCount = 0;
    mediaPointerFine.removeEventListener('change', updatePointerFine);
    mediaPointerCoarse.removeEventListener('change', updatePointerCoarse);
    mediaPointerNone.removeEventListener('change', updatePointerNone);
    mediaPointerHover.removeEventListener('change', updatePointerHover);
    mediaModeStandalone.removeEventListener('change', updateModeStandalone);
    Object.assign(platformState, platformStateDefaults);
  }
}

/**
 * Returns reactive booleans for platform related flags.
 * @public
 *
 * @param options - Reactive options for `usePlatform`.
 * @returns An object with reactive platform related flags. `null` value is returned in auto detect mode on server-side and on hydration on client-side.
 */
// eslint-disable-next-line antfu/top-level-function
export const usePlatform = (options?: UsePlatformOptions): UsePlatformReturn => {
  const localOptions = useInjectedOptions(injectionKey, options) ?? {};

  if (getCurrentInstance()) {
    onMounted(executeWhenMounted);
    onBeforeUnmount(executeWhenUnmounted);
  }

  const forcePlatform = computed(() => {
    const userAgent = toValue(localOptions.forceUserAgent);
    const forceHasTouch = toValue(localOptions.forceHasTouch);

    return typeof userAgent === 'string' && userAgent.length > 0
      ? parseUserAgent(
        userAgent,
        forceHasTouch == null ? null : forceHasTouch === true,
      )
      : null;
  });

  return {
    hasPointer: computed(() => platformState.hasPointer ?? toValue(localOptions.forceHasPointer) ?? null),
    hasTouch: computed(() => platformState.hasTouch ?? forcePlatform.value?.hasTouch ?? toValue(localOptions.forceHasTouch) ?? null),
    hasHover: computed(() => platformState.hasHover ?? toValue(localOptions.forceHasPointer) ?? null),

    isDesktop: computed(() => platformState.isDesktop ?? forcePlatform.value?.isDesktop ?? null),
    isMobile: computed(() => platformState.isMobile ?? forcePlatform.value?.isMobile ?? null),

    isStandalone: computed(() => platformState.isStandalone ?? toValue(localOptions.forceIsStandalone) ?? null),
    isEmulated: computed(() => platformState.isEmulated ?? null),

    isAndroid: computed(() => platformState.isAndroid ?? forcePlatform.value?.isAndroid ?? null),
    isIos: computed(() => platformState.isIos ?? forcePlatform.value?.isIos ?? null),
    isLinux: computed(() => platformState.isLinux ?? forcePlatform.value?.isLinux ?? null),
    isMacos: computed(() => platformState.isMacos ?? forcePlatform.value?.isMacos ?? null),
    isWindows: computed(() => platformState.isWindows ?? forcePlatform.value?.isWindows ?? null),
    isChromeos: computed(() => platformState.isChromeos ?? forcePlatform.value?.isChromeos ?? null),

    isChrome: computed(() => platformState.isChrome ?? forcePlatform.value?.isChrome ?? null),
    isFirefox: computed(() => platformState.isFirefox ?? forcePlatform.value?.isFirefox ?? null),
    isSafari: computed(() => platformState.isSafari ?? forcePlatform.value?.isSafari ?? null),
  };
};

usePlatform.install = (app: App, options: UsePlatformOptions | null = null) => {
  app.provide(injectionKey, getInjectedOptionsRef(options));
};
