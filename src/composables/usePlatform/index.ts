import type { ComputedRef, MaybeRef } from 'vue';
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  unref,
} from 'vue';

type platformKeys = string & (
  'hasPointer' | 'hasTouch' | 'hasHover'
  | 'isDesktop' | 'isMobile'
  | 'isStandalone' | 'isEmulated'
  | 'isAndroid' | 'isIos' | 'isLinux' | 'isMacos' | 'isWindows' | 'isChromeos'
  | 'isChrome' | 'isFirefox' | 'isSafari'
);
const platform = reactive<Record<platformKeys, boolean | null>>({
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
});
function updatePointerFine(evt: MediaQueryListEvent) {
  platform.hasPointer = evt.matches;
};
function updatePointerCoarse(evt: MediaQueryListEvent) {
  platform.hasTouch = evt.matches;
};
function updatePointerHover(evt: MediaQueryListEvent) {
  platform.hasHover = evt.matches;
};
function updatePointerNone(evt: MediaQueryListEvent) {
  if (evt.matches) {
    platform.hasPointer = false;
    platform.hasTouch = false;
    platform.hasHover = false;
  }
};
function updateModeStandalone(evt: MediaQueryListEvent) {
  platform.isStandalone = evt.matches;
};

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
  const platform = {
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
  };

  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && hasTouch === true)) {
    platform.isMobile = true;
    platform.isIos = true;

    if (/crios/i.test(userAgent)) {
      platform.isChrome = true;
    } else if (/fxios/i.test(userAgent)) {
      platform.isFirefox = true;
    } else {
      platform.isSafari = true;
    }

    if ((vendor != null && /apple/i.test(vendor) === false) || maxTouchPoints === 0 || maxTouchPoints === 1) {
      platform.isEmulated = true;
    }
  } else {
    if (/macintosh/i.test(userAgent)) {
      platform.isMacos = true;
      platform.isDesktop = true;
    } else if (/cros/i.test(userAgent)) {
      platform.isChromeos = true;
      platform.isDesktop = true;
    } else if (/android/i.test(userAgent)) {
      platform.isAndroid = true;
      platform.isMobile = true;

      if (maxTouchPoints === 0 || maxTouchPoints === 1) {
        platform.isEmulated = true;
      }
    } else if (/linux|x11/i.test(userAgent)) {
      platform.isLinux = true;
      platform.isDesktop = true;
    } else if (/windows/i.test(userAgent)) {
      platform.isWindows = true;
      platform.isDesktop = true;
    }

    if (/firefox/i.test(userAgent)) {
      platform.isFirefox = true;
    } else if (/chrom/i.test(userAgent) || userAgentData != null) {
      platform.isChrome = true;
    } else if (/safari/i.test(userAgent)) {
      platform.isSafari = true;
    }
  }

  return platform;
}

/**
 * Options for `usePlatform`.
 * @public
 */
export interface UsePlatformOptions {
  /** Forced hasPointer. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceHasPointer?: MaybeRef<boolean | null>;
  /** Forced hasTouch. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceHasTouch?: MaybeRef<boolean | null>;
  /** Forced isStandalone. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceIsStandalone?: MaybeRef<boolean | null>;
  /** Forced UserAgent. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change. */
  forceUserAgent?: MaybeRef<string | null>;
}

/**
 * Returned object from `usePlatform`.
 * @public
 */
export interface UsePlatformResponse {
  /** Platform has (mouse). Reactive, returns `null` when not yet detected (on server side or before hydration). */
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

/**
 * Returns reactive booleans for platform related flags.
 * @public
 * @param options - Reactive options for `usePlatform`.
 * @returns An object with reactive platform related flags. `null` value is returned in auto detect mode on server-side and on hydration on client-side.
 */
export function usePlatform(options: UsePlatformOptions = {}) {
  if (getCurrentInstance()) {
    onMounted(() => {
      mountedCount += 1;

      if (mountedCount === 1) {
        mediaPointerFine = matchMedia('screen and (any-pointer: fine)');
        mediaPointerFine.addEventListener('change', updatePointerFine);
        platform.hasPointer = mediaPointerFine.matches;

        mediaPointerCoarse = matchMedia('screen and (any-pointer: coarse)');
        mediaPointerCoarse.addEventListener('change', updatePointerCoarse);
        platform.hasTouch = mediaPointerCoarse.matches;

        mediaPointerNone = matchMedia('screen and (any-pointer: none)');
        mediaPointerNone.addEventListener('change', updatePointerNone);
        if (mediaPointerNone.matches) {
          platform.hasPointer = false;
          platform.hasTouch = false;
          platform.hasHover = false;
        }

        mediaPointerHover = matchMedia('screen and (any-hover: hover)');
        mediaPointerHover.addEventListener('change', updatePointerHover);
        platform.hasHover = mediaPointerHover.matches;

        mediaModeStandalone = matchMedia('screen and (display-mode: standalone)');
        mediaModeStandalone.addEventListener('change', updateModeStandalone);
        platform.isStandalone = mediaModeStandalone.matches || (window.navigator && (window.navigator as unknown as Record<string, unknown>).standalone === true);

        Object.assign(platform, parseUserAgent(
          navigator.userAgent,
          platform.hasTouch,
          navigator.vendor,
          navigator.maxTouchPoints,
          (navigator as unknown as Record<string, unknown>).userAgentData,
        ));
      }

      onUnmounted(() => {
        mountedCount -= 1;

        if (mountedCount === 0) {
          mediaPointerFine.removeEventListener('change', updatePointerFine);
          mediaPointerCoarse.removeEventListener('change', updatePointerCoarse);
          mediaPointerNone.removeEventListener('change', updatePointerNone);
          mediaPointerHover.removeEventListener('change', updatePointerHover);
          mediaModeStandalone.removeEventListener('change', updateModeStandalone);
        }
      });
    });
  }

  const forcePlatform = computed(() => {
    const userAgent = unref(options.forceUserAgent);

    return typeof userAgent === 'string' && userAgent.length > 0
      ? parseUserAgent(
        userAgent,
        unref(options.forceHasTouch) == null ? null : unref(options.forceHasTouch) === true,
      )
      : null;
  });

  return {
    hasPointer: computed(() => (platform.hasPointer === null ? (unref(options.forceHasPointer) == null ? null : unref(options.forceHasPointer) === true) : platform.hasPointer)),
    hasTouch: computed(() => (platform.hasTouch === null ? (unref(options.forceHasTouch) == null ? null : unref(options.forceHasTouch) === true) : platform.hasTouch)),
    hasHover: computed(() => (platform.hasHover === null ? (unref(options.forceHasPointer) == null ? null : unref(options.forceHasPointer) === true) : platform.hasHover)),

    isDesktop: computed(() => (platform.isDesktop === null ? (forcePlatform.value == null ? null : forcePlatform.value.isDesktop) : platform.isDesktop)),
    isMobile: computed(() => (platform.isMobile === null ? (forcePlatform.value == null ? null : forcePlatform.value.isMobile) : platform.isMobile)),

    isStandalone: computed(() => (platform.isStandalone === null ? (unref(options.forceIsStandalone) == null ? null : unref(options.forceIsStandalone) === true) : platform.isStandalone)),
    isEmulated: computed(() => (platform.isEmulated === null ? null : platform.isEmulated)),

    isAndroid: computed(() => (platform.isAndroid === null ? (forcePlatform.value == null ? null : forcePlatform.value.isAndroid) : platform.isAndroid)),
    isIos: computed(() => (platform.isIos === null ? (forcePlatform.value == null ? null : forcePlatform.value.isIos) : platform.isIos)),
    isLinux: computed(() => (platform.isLinux === null ? (forcePlatform.value == null ? null : forcePlatform.value.isLinux) : platform.isLinux)),
    isMacos: computed(() => (platform.isMacos === null ? (forcePlatform.value == null ? null : forcePlatform.value.isMacos) : platform.isMacos)),
    isWindows: computed(() => (platform.isWindows === null ? (forcePlatform.value == null ? null : forcePlatform.value.isWindows) : platform.isWindows)),
    isChromeos: computed(() => (platform.isChromeos === null ? (forcePlatform.value == null ? null : forcePlatform.value.isChromeos) : platform.isChromeos)),

    isChrome: computed(() => (platform.isChrome === null ? (forcePlatform.value == null ? null : forcePlatform.value.isChrome) : platform.isChrome)),
    isFirefox: computed(() => (platform.isFirefox === null ? (forcePlatform.value == null ? null : forcePlatform.value.isFirefox) : platform.isFirefox)),
    isSafari: computed(() => (platform.isSafari === null ? (forcePlatform.value == null ? null : forcePlatform.value.isSafari) : platform.isSafari)),
  } as UsePlatformResponse;
};
