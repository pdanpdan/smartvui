import type { MaybeRef } from 'vue';

import { ref } from 'vue';

import { useColorTheme, useColorThemeStyle } from '$lib/composables/useColorTheme';

export function useGlobalColorTheme(isDark?: MaybeRef<boolean | null>) {
  const source = ref<string | number>('#f8b200');
  const customColors = ref([ { name: 'SmartVui', value: '#0d8fba', blend: true } ]);
  const colorTheme = useColorTheme({ source, customColors });
  return {
    sourceColor: source,
    customColors,

    colorTheme,
    ...useColorThemeStyle({ colorTheme, isDark }),
  };
}
