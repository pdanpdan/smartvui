import type { MaybeRef } from 'vue';
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  unref,
} from 'vue';

const prefersDark = ref<boolean | null>(null);
function update(evt: MediaQueryListEvent) {
  prefersDark.value = evt.matches;
};

let mountedCount = 0;
let media: MediaQueryList;

/**
 * Returns a reactive boolean for `prefers-color-scheme: dark`.
 * @public
 * @param forcePrefersDark - Forced dark mode preference. Use `null` or `undefined` to use auto detect mode. Using a reactive value will update the returned value on change.
 * @returns Preference for `dark` mode. `null` value is returned in auto detect mode on server-side and on hydration on client-side.
 */
export function usePrefersDark(forcePrefersDark?: MaybeRef<boolean | null>) {
  if (getCurrentInstance()) {
    onMounted(() => {
      mountedCount += 1;

      if (mountedCount === 1) {
        media = matchMedia('screen and (prefers-color-scheme: dark)');
        media.addEventListener('change', update);

        prefersDark.value = media.matches;
      }

      onUnmounted(() => {
        mountedCount = mountedCount > 0 ? mountedCount - 1 : 0;

        if (mountedCount === 0) {
          media.removeEventListener('change', update);
        }
      });
    });
  }

  return computed(() => {
    const force = unref(forcePrefersDark);

    return force == null ? prefersDark.value : force;
  });
};
