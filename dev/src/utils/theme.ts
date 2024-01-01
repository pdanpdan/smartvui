import { ref } from 'vue';
import type { MaybeRef } from 'vue';
import { usePrefersDark } from '$lib/composables/usePrefersDark';
import { useTheme, useThemeStyle } from '$lib/composables/useTheme';

import { usePageContext } from '$dev/renderer/usePageContext';

const forceDark = ref<boolean | null>(null);

export function useDark() {
  const { prefersDark, isHydration } = usePageContext();

  if (isHydration !== false) {
    forceDark.value = prefersDark === undefined ? null : prefersDark;
  }

  return {
    forceDark,
    isDark: usePrefersDark(forceDark),
  };
}

const source = ref<string>('#f8b200');
const customColors = ref([ { name: 'SmartVui', value: '#0d8fba', blend: true } ]);
const theme = useTheme({ source, customColors });

export function useColorTheme(isDark?: MaybeRef<boolean | null>) {
  return {
    sourceColor: source,
    customColors,

    theme,
    ...useThemeStyle({ theme, isDark }),
  };
}
