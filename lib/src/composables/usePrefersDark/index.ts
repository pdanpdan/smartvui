import type {
  App,
  ComputedRef,
  MaybeRefOrGetter,
  Raw,
  Ref,
} from 'vue';

import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
} from 'vue';

import { createInjectedOptions, useInjectedOptions } from '$lib/utils/injectedOptions';

const prefersDark = ref<boolean | null>(null);
function update(evt: MediaQueryListEvent) {
  prefersDark.value = evt.matches;
}

let mountedCount = 0;
let media: MediaQueryList;
const defaultGroup = Symbol('defaultPrefersDarkGroup');

/**
 * Options for `usePlatform`.
 *
 * @public
 */
export interface UsePrefersDarkOptions {
  /** Forced prefersDark. Use `null` or `undefined` to use auto detect mode. */
  forceDark?: MaybeRefOrGetter<boolean | null>;
  /** Set a group key for the preference. You can create use dark preferences for multiple areas. */
  group?: symbol | string;
}

/**
 * Returned object from `usePrefersDark`.
 *
 * @public
 */
export interface UsePrefersDarkReturn {
  /** Prefers dark mode. */
  isDark: ComputedRef<boolean>;
  /** Control dark preference. Use `null` for auto (system default). */
  forceDark: Ref<boolean | null>;
}

interface UsePrefersDarkStore {
  [ group: symbol | string ]: Ref<boolean | null>;
}

const { injectionKey, getInjectedOptionsRef } = createInjectedOptions<Raw<UsePrefersDarkStore>>('usePrefersDark');

function executeWhenMounted() {
  mountedCount += 1;

  if (mountedCount === 1) {
    media = matchMedia('screen and (prefers-color-scheme: dark)');
    media.addEventListener('change', update);

    prefersDark.value = media.matches;
  }
}

function executeWhenUnmounted() {
  mountedCount -= 1;

  if (mountedCount <= 0) {
    mountedCount = 0;
    media.removeEventListener('change', update);
    prefersDark.value = null;
  }
}

/**
 * Returns a reactive boolean for `prefers-color-scheme: dark`.
 *
 * @public
 * @param options - Options for `usePrefersDark`.
 * @returns An object with reactive status for dark mode and toggle for preferred mode.
 */
// eslint-disable-next-line antfu/top-level-function
export const usePrefersDark = (options?: UsePrefersDarkOptions) => {
  const store: Raw<UsePrefersDarkStore> = useInjectedOptions(injectionKey, {});
  const group = options?.group ?? defaultGroup;
  if (!store[ group ]) {
    store[ group ] = ref<boolean | null>(toValue(options?.forceDark) ?? null);
  }
  const forceDark = store[ group ];

  if (getCurrentInstance()) {
    onMounted(executeWhenMounted);
    onBeforeUnmount(executeWhenUnmounted);
  }

  return {
    isDark: computed(() => forceDark.value ?? prefersDark.value),
    forceDark,
  };
};

usePrefersDark.install = (app: App, _?: UsePrefersDarkOptions | null) => {
  app.provide(injectionKey, getInjectedOptionsRef(markRaw({} as UsePrefersDarkStore)));
};
