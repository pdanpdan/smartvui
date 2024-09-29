import type { InjectionKey, Ref } from 'vue';

import {} from '@vue/shared';
import { getCurrentInstance, inject, ref } from 'vue';

/**
 * Check if options are already saved for and injection key.
 * If they are not saved then save current ones as default.
 *
 * @public
 * @param injectionKey - Vue injection key.
 * @param options - options.
 * @return The already saved options if available or the current ones otherwise.
 */
export function useInjectedOptions<T>(injectionKey: InjectionKey<Ref<T | null>>, options: T) {
  if (getCurrentInstance()) {
    const optionsRef = inject(injectionKey, null);
    if (optionsRef != null) {
      if (optionsRef.value) {
        return optionsRef.value;
      } else {
        optionsRef.value = options;
      }
    } else {
      console.warn(`[ SmartVui ] ${ injectionKey.description } was not installed. It will not work as a singleton.`);
    }
  }

  return options;
}

/**
 * Create an injection key and a function to get a ref for the storage
 * of the options saved for that injection key.
 *
 * @public
 * @param name - Symbol or name used for the injection key.
 * @return Object with created injection key and the function to retrieve the ref for its associated storage.
 */
export function createInjectedOptions<T>(name: string) {
  const injectionKey = Symbol(name) as InjectionKey<Ref<T | null>>;

  return {
    injectionKey,
    getInjectedOptionsRef(defaultValue: T | null = null) {
      return ref<T | null>(defaultValue);
    },
  };
}
