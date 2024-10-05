import type {
  App,
  ComputedRef,
  MaybeRefOrGetter,
  Ref,
  WritableComputedRef,
} from 'vue';

import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toValue,
  watchSyncEffect,
} from 'vue';

import type { UsePlatformReturn } from '$lib/composables';

import { usePlatform } from '$lib/composables';
import { isEditableElement } from '$lib/utils/editable';
import { createInjectedOptions, useInjectedOptions } from '$lib/utils/injectedOptions';
import { isClient } from '$lib/utils/is';
import { throttle } from '$lib/utils/throttle';

const SCREEN_DEFAULT_WIDTH = 1280;
const SCREEN_DEFAULT_HEIGHT = 960;
const IOS_FIX_OVERSCROLL_COUNT_MAX = 20; // magic experimental value

type screenKey = string & (
  'pageInlineSize' | 'pageBlockSize'
  | 'screenInlineSize' | 'screenBlockSize'
  | 'viewInlineSize' | 'viewBlockSize' | 'viewScale'
  | 'scrollInlineGutter' | 'scrollBlockGutter'
  | 'pageInlineStart' | 'pageBlockStart'
);
const screenStateDefaults: Record<screenKey, number | null> = {
  pageInlineSize: null,
  pageBlockSize: null,
  screenInlineSize: null,
  screenBlockSize: null,
  viewInlineSize: null,
  viewBlockSize: null,
  viewScale: null,
  scrollInlineGutter: null,
  scrollBlockGutter: null,
  pageInlineStart: null,
  pageBlockStart: null,
};
const screenState = reactive<Record<screenKey, number | null>>({ ...screenStateDefaults });

const virtualKeyboardOpen = ref<boolean>(false);

const scrollLockRequests = ref<number>(0);
const onScrollUnlockedQueue: (() => void)[] = [];

watchSyncEffect(() => {
  if (!isClient) {
    return;
  }

  if (scrollLockRequests.value > 0) {
    scrollLockOn();
  } else {
    scrollLockRequests.value = 0;
    scrollLockOff();

    const q = onScrollUnlockedQueue.slice();
    onScrollUnlockedQueue.length = 0;

    for (const fn of q) {
      fn();
    }
  }
});

const workState = {
  isIos: false,
  isAndroid: false,
  scrollCount: 0,
  prevViewScale: 1,
  prevViewBlockScroll: 0,
  prevViewBlockSize: 0,
  prevViewBlockSizeGood: 0,
  resizeObserver: null as ResizeObserver | null,
};

const updateValuesThrottled = throttle(updateValues);

let iosFixOverscrollTimeout: number | null = null;
function iosFixOverscroll() {
  /* v8 ignore next 4 */
  if (iosFixOverscrollTimeout !== null) {
    cancelAnimationFrame(iosFixOverscrollTimeout);
    iosFixOverscrollTimeout = null;
  }

  const pageBlockSize = screenState.pageBlockSize!;
  const pageBlockStart = screenState.pageBlockStart!;
  const viewBlockSize = screenState.viewBlockSize!;
  const screenBlockSize = screenState.screenBlockSize!;
  const scrollCorrection = (viewBlockSize + Math.ceil(window.visualViewport!.offsetTop) >= screenBlockSize - 1) || (viewBlockSize + pageBlockStart > pageBlockSize + 1)
    ? Math.min(-1, (pageBlockSize + 1 - pageBlockStart - viewBlockSize) / 2)
    : (pageBlockStart < 0 ? Math.max(1, -pageBlockStart / 2) : null);
  if (viewBlockSize < screenBlockSize && scrollCorrection !== null) {
    if (workState.scrollCount < IOS_FIX_OVERSCROLL_COUNT_MAX) {
      workState.scrollCount += 1;
      iosFixOverscrollTimeout = requestAnimationFrame(() => {
        iosFixOverscrollTimeout = null;
        workState.scrollCount = IOS_FIX_OVERSCROLL_COUNT_MAX;
        iosFixOverscroll();
      });
    } else {
      window.scrollBy(0, scrollCorrection);
    }
  } else {
    workState.scrollCount = 0;
  }
}

function iosOnFocusin(evt: FocusEvent) {
  const target = evt.target as HTMLElement | null;
  if (isEditableElement(target)) {
    virtualKeyboardOpen.value = true;
    window.scrollBy(0, 0);

    if (target.closest('[sv-no-focus-fix], [data-sv-no-focus-fix]')) {
      return;
    }

    let needFocusFix = target.closest('[sv-screen-anchored], [data-sv-screen-anchored]') != null;
    let el: Element | null = target;

    while (!needFocusFix && el) {
      if (el.matches('dialog, [popover]') || window.getComputedStyle(el).position === 'fixed') {
        needFocusFix = true;
      }
      el = el.parentElement;
    }

    if (needFocusFix) {
      const focusFixParent = target?.closest('dialog, [popover]') ?? document.body;
      const focusFixTarget = document.createElement('input');
      focusFixTarget.setAttribute('type', target.getAttribute('type') ?? 'text');
      focusFixTarget.setAttribute('inputmode', target.getAttribute('inputmode') ?? '');
      focusFixTarget.dataset.svIosFocusFixTarget = '';
      focusFixTarget.dataset.svNoFocusFix = '';
      (focusFixTarget as unknown as { __focusTargetPlaceholder: HTMLElement; }).__focusTargetPlaceholder = target;
      focusFixParent.appendChild(focusFixTarget);
      target.dataset.svNoFocusFix = '';
      focusFixTarget.focus();

      requestAnimationFrame(() => {
        focusFixTarget.focus();
      });

      setTimeout(() => {
        if (document.activeElement === focusFixTarget && target) {
          target.focus();
        }
        focusFixTarget.remove();
        delete target?.dataset.svNoFocusFix;
      }, 150);
    }
  }
}

function iosOnFocusout(evt: FocusEvent) {
  const target = evt.target as Element | null;

  if (isEditableElement(target)) {
    virtualKeyboardOpen.value = false;
    window.scrollBy(0, 0);
  }
}

function updateValues() {
  const { innerHeight, innerWidth } = window;
  const {
    clientHeight,
    clientWidth,
    scrollHeight,
    scrollWidth,
    scrollTop,
    scrollLeft,
  } = document.documentElement;
  const {
    height = 0,
    width = 0,
    offsetLeft = 0,
    offsetTop = 0,
    scale = 1,
  } = window.visualViewport ?? {};

  if (workState.isIos) {
    let scaleCorrection = 1;
    if (workState.prevViewBlockSize.toFixed(2) === height.toFixed(2) && workState.prevViewScale.toFixed(2) !== scale.toFixed(2)) {
      scaleCorrection = workState.prevViewScale / scale;
    } else {
      workState.prevViewBlockSize = height;
      workState.prevViewScale = scale;
    }

    const newScreenState = {
      pageInlineSize: scrollWidth,
      pageBlockSize: scrollHeight,
      screenInlineSize: clientWidth,
      screenBlockSize: clientHeight,
      viewInlineSize: Math.floor(width * scaleCorrection),
      viewBlockSize: Math.floor(height * scaleCorrection),
      viewScale: scale,
      scrollInlineGutter: 0,
      scrollBlockGutter: 0,
      pageInlineStart: Math.floor(scrollLeft),
      pageBlockStart: Math.floor(scrollTop),
    };

    Object.assign(screenState, newScreenState);

    setTimeout(iosFixOverscroll, 150);
  } else if (workState.isAndroid) {
    Object.assign(screenState, {
      pageInlineSize: scrollWidth,
      pageBlockSize: scrollHeight,
      screenInlineSize: clientWidth,
      screenBlockSize: clientHeight,
      viewInlineSize: Math.floor(width || clientWidth),
      viewBlockSize: Math.floor(height || clientHeight),
      viewScale: scale,
      scrollInlineGutter: 0,
      scrollBlockGutter: 0,
      pageInlineStart: Math.floor(scrollLeft + offsetLeft),
      pageBlockStart: Math.floor(scrollTop + offsetTop),
    });

    const vk = screenState.viewBlockSize! * screenState.viewScale! < screenState.screenBlockSize! * 0.8;
    if (virtualKeyboardOpen.value !== vk) {
      virtualKeyboardOpen.value = vk;
    }
  } else {
    Object.assign(screenState, {
      pageInlineSize: scrollWidth,
      pageBlockSize: scrollHeight,
      screenInlineSize: innerWidth,
      screenBlockSize: innerHeight,
      viewInlineSize: Math.floor(width || clientWidth),
      viewBlockSize: Math.floor(height || clientHeight),
      viewScale: scale,
      scrollInlineGutter: innerHeight - clientHeight,
      scrollBlockGutter: innerWidth - clientWidth,
      pageInlineStart: Math.floor(scrollLeft + offsetLeft),
      pageBlockStart: Math.floor(scrollTop + offsetTop),
    });

    if (virtualKeyboardOpen.value !== false) {
      virtualKeyboardOpen.value = false;
    }
  }
}

let restorePageInlineStart: number;
let restorePageBlockStart: number;
let restorePageInlineScroll: number;
let restorePageBlockScroll: number;

function scrollLockOn() {
  const { dataset, style } = document.documentElement;

  if (dataset.svScrollLocked) {
    return;
  }

  if (workState.isIos) {
    const { scrollLeft, scrollTop, scrollHeight, scrollWidth } = document.documentElement;
    const { offsetLeft = 0, offsetTop = 0, pageLeft = 0, pageTop = 0 } = window.visualViewport!;
    restorePageInlineStart = scrollLeft;
    restorePageBlockStart = scrollTop;

    dataset.svScrollLocked = 'ios';

    const { scrollWidth: screenWidth, scrollHeight: screenHeight } = document.documentElement;
    const inlineScrollReq = Math.max(0, pageLeft - offsetLeft);
    const inlineScrollMax = Math.max(0, scrollWidth - screenWidth);
    const blockScrollReq = Math.max(0, pageTop - offsetTop);
    const blockScrollMax = Math.max(0, scrollHeight - screenHeight);

    const inlineStart = Math.max(0, Math.min(inlineScrollMax, inlineScrollReq));
    const blockStart = Math.max(0, Math.min(blockScrollMax, blockScrollReq));

    style.setProperty('--sv-scroll-locked-inline-start', `${ -inlineStart }px`);
    style.setProperty('--sv-scroll-locked-block-start', `${ -blockStart }px`);

    window.scrollTo(
      offsetLeft + Math.max(0, inlineScrollReq - inlineScrollMax),
      offsetTop + Math.max(0, blockScrollReq - blockScrollMax),
    );
    restorePageInlineScroll = document.documentElement.scrollLeft;
    restorePageBlockScroll = document.documentElement.scrollTop;
  } else if (workState.isAndroid) {
    dataset.svScrollLocked = 'android';
  } else {
    if (screenState.scrollBlockGutter! > 0) {
      dataset.svScrollLockedGutter = '';
    } else {
      delete dataset.svScrollLockedGutter;
    }
    dataset.svScrollLocked = 'desktop';
  }
}

function scrollLockOff() {
  const { dataset } = document.documentElement;

  if (!dataset.svScrollLocked) {
    return;
  }

  if (workState.isIos) {
    const { scrollLeft, scrollTop } = document.documentElement;
    delete dataset.svScrollLocked;
    window.scrollTo(restorePageInlineStart + scrollLeft - restorePageInlineScroll, restorePageBlockStart + scrollTop - restorePageBlockScroll);
  } else if (workState.isAndroid) {
    delete dataset.svScrollLocked;
  } else {
    delete dataset.svScrollLocked;
    delete dataset.svScrollLockedGutter;
  }
}

let mountedCount = 0;

/**
 * Options for `useScreen`.
 *
 * @public
 */
export interface UseScreenOptions {
  /** Initial page width on server-side. Use `null` or `undefined` to use default size (1280). Using a reactive value will update the returned value on change. */
  width?: MaybeRefOrGetter<number | null>;
  /** Initial page height on server-side. Use `null` or `undefined` to use default size (960). Using a reactive value will update the returned value on change. */
  height?: MaybeRefOrGetter<number | null>;
}

/**
 * Returned object from `useScreen`.
 *
 * @public
 */
export interface UseScreenReturn {
  /** Page (body) inline size in `px`. Reactive. */
  pageInlineSize: ComputedRef<number>;
  /** Page (body) block size in `px`. Reactive. */
  pageBlockSize: ComputedRef<number>;
  /** Screen (window) inline size in `px`. Reactive. */
  screenInlineSize: ComputedRef<number>;
  /** Screen (window) block size in `px`. Reactive. */
  screenBlockSize: ComputedRef<number>;
  /** View (visible viewport) inline size in `px`. Reactive. */
  viewInlineSize: ComputedRef<number>;
  /** View (visible viewport) block size in `px`. Reactive. */
  viewBlockSize: ComputedRef<number>;
  /** View (visible viewport) scale factor. Reactive. */
  viewScale: ComputedRef<number>;
  /** Inline (horizontal) scrollbar width in `px`. Reactive. */
  scrollInlineGutter: ComputedRef<number>;
  /** Block (vertical) scrollbar width in `px`. Reactive. */
  scrollBlockGutter: ComputedRef<number>;
  /** Page (body) inline scroll start (scrollLeft) in `px`. Reactive. */
  pageInlineStart: ComputedRef<number>;
  /** Page (body) block scroll start (scrollTop) in `px`. Reactive. */
  pageBlockStart: ComputedRef<number>;
  /** Virtual keyboard is open. Reactive. */
  virtualKeyboardOpen: ComputedRef<boolean>;
  /** Page (body) scroll is locked. Reactive, always `false` on SSR. */
  scrollLocked: ComputedRef<boolean>;
  /** Page (body) scroll lock is requested. Reactive. */
  scrollLockRequested: WritableComputedRef<boolean>;
  /**
   * Execute a function when scroll is unlocked. Will not execute on SSR.
   *
   * @param fn - Function to be executed.
   */
  onScrollUnlocked: (fn: () => void) => void;
  /** Clear a function from queue or the whole queue of functions to be executed when the scroll is unlocked. */
  onScrollUnlockedClear: (what: true | (() => void)) => void;
}

const { injectionKey, getInjectedOptionsRef } = createInjectedOptions<UseScreenOptions>('useScreen');

function executeWhenMounted(
  scrollLockRequested: Ref<boolean>,
  { isIos, isAndroid }: UsePlatformReturn,
) {
  mountedCount += 1;

  if (mountedCount === 1) {
    workState.isIos = toValue(isIos) === true;
    workState.isAndroid = toValue(isAndroid) === true;

    window.addEventListener('resize', updateValuesThrottled, { passive: true });
    window.addEventListener('scroll', updateValuesThrottled, { passive: true });

    screen.orientation?.addEventListener('change', updateValuesThrottled, { passive: true });

    window.visualViewport?.addEventListener('resize', updateValuesThrottled, { passive: true });
    window.visualViewport?.addEventListener('scroll', updateValuesThrottled, { passive: true });

    if (workState.isIos) {
      window.addEventListener('focusin', iosOnFocusin, { passive: true });
      window.addEventListener('focusout', iosOnFocusout, { passive: true });
    }

    const { virtualKeyboard } = navigator as typeof navigator & { virtualKeyboard?: EventSource & { overlaysContent: boolean; }; };
    if (virtualKeyboard) {
      virtualKeyboard.addEventListener('geometrychange', updateValuesThrottled, { passive: true });
    }

    workState.resizeObserver = new ResizeObserver(() => updateValuesThrottled());
    workState.resizeObserver.observe(document.documentElement);

    updateValues();
  }

  onUnmounted(() => executeWhenUnmounted(scrollLockRequested));
}

function executeWhenUnmounted(scrollLockRequested: Ref<boolean>) {
  mountedCount -= 1;
  if (scrollLockRequested.value) {
    scrollLockRequested.value = false;
    scrollLockRequests.value -= 1;
  }

  if (mountedCount <= 0) {
    mountedCount = 0;

    window.removeEventListener('resize', updateValuesThrottled);
    window.removeEventListener('scroll', updateValuesThrottled);

    screen.orientation?.removeEventListener('change', updateValuesThrottled);

    window.visualViewport?.removeEventListener('resize', updateValuesThrottled);
    window.visualViewport?.removeEventListener('scroll', updateValuesThrottled);

    if (workState.isIos) {
      window.removeEventListener('focusin', iosOnFocusin);
      window.removeEventListener('focusout', iosOnFocusout);
    }

    const { virtualKeyboard } = navigator as typeof navigator & { virtualKeyboard?: EventSource & { overlaysContent: boolean; }; };
    if (virtualKeyboard) {
      virtualKeyboard.removeEventListener('geometrychange', updateValuesThrottled);
    }

    if (workState.resizeObserver) {
      workState.resizeObserver.disconnect();
      workState.resizeObserver = null;
    }
    Object.assign(screenState, screenStateDefaults);
  }
}

/**
 * Returns reactive values for screen related measurements and flags.
 *
 * @public
 * @param options - Reactive options for `useScreen`.
 * @returns An object with reactive screen related measurements and flags.
 */
// eslint-disable-next-line antfu/top-level-function
export const useScreen = (options?: UseScreenOptions): UseScreenReturn => {
  const localOptions = useInjectedOptions(injectionKey, options) ?? {};
  const scrollLockRequested = ref<boolean>(false);
  const platform = usePlatform();

  if (getCurrentInstance()) {
    onMounted(() => executeWhenMounted(scrollLockRequested, platform));
  }

  return {
    pageInlineSize: computed(() => screenState.pageInlineSize ?? toValue(localOptions.width) ?? SCREEN_DEFAULT_WIDTH),
    pageBlockSize: computed(() => screenState.pageBlockSize ?? toValue(localOptions.height) ?? SCREEN_DEFAULT_HEIGHT),
    screenInlineSize: computed(() => screenState.screenInlineSize ?? toValue(localOptions.width) ?? SCREEN_DEFAULT_WIDTH),
    screenBlockSize: computed(() => screenState.screenBlockSize ?? toValue(localOptions.height) ?? SCREEN_DEFAULT_HEIGHT),
    viewInlineSize: computed(() => screenState.viewInlineSize ?? toValue(localOptions.width) ?? SCREEN_DEFAULT_WIDTH),
    viewBlockSize: computed(() => screenState.viewBlockSize ?? toValue(localOptions.height) ?? SCREEN_DEFAULT_HEIGHT),
    viewScale: computed(() => screenState.viewScale ?? 1),
    scrollInlineGutter: computed(() => screenState.scrollInlineGutter ?? 0),
    scrollBlockGutter: computed(() => screenState.scrollBlockGutter ?? 0),
    pageInlineStart: computed(() => screenState.pageInlineStart ?? 0),
    pageBlockStart: computed(() => screenState.pageBlockStart ?? 0),
    virtualKeyboardOpen: computed(() => virtualKeyboardOpen.value),
    scrollLocked: computed(() => (isClient ? scrollLockRequests.value > 0 : false)),

    scrollLockRequested: computed({
      get() {
        return scrollLockRequested.value;
      },

      set(value: boolean) {
        if (!isClient) {
          scrollLockRequested.value = value;
          return;
        }

        if (value && !scrollLockRequested.value) {
          scrollLockRequested.value = true;
          scrollLockRequests.value += 1;
        } else if (!value && scrollLockRequested.value) {
          scrollLockRequested.value = false;
          scrollLockRequests.value -= 1;
        }
      },
    }),

    onScrollUnlocked(fn) {
      if (!isClient) {
        return;
      }

      if (scrollLockRequests.value === 0) {
        fn();
      } else {
        onScrollUnlockedQueue.push(fn);
      }
    },
    onScrollUnlockedClear(what) {
      if (what === true) {
        onScrollUnlockedQueue.length = 0;
      } else {
        const index = onScrollUnlockedQueue.indexOf(what);
        if (index > -1) {
          onScrollUnlockedQueue.splice(index, 1);
        }
      }
    },
  };
};

useScreen.install = (app: App, options: UseScreenOptions | null = null) => {
  app.provide(injectionKey, getInjectedOptionsRef(options));
};
