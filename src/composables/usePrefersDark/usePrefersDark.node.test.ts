// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';

import { defineComponent, ref } from 'vue';
import { usePrefersDark } from '..';

describe('should return value', () => {
  it('should return forced fixed value', () => {
    expect(usePrefersDark().value).toBe(null);
    expect(usePrefersDark(null).value).toBe(null);
    expect(usePrefersDark(true).value).toBe(true);
    expect(usePrefersDark(false).value).toBe(false);
  });

  it('should return forced reactive value', () => {
    const forcedDark = ref<boolean | null>(null);
    const isDark = usePrefersDark(forcedDark);

    expect(isDark.value).toBe(null);

    forcedDark.value = true;
    expect(isDark.value).toBe(true);

    forcedDark.value = false;
    expect(isDark.value).toBe(false);
  });

  it('should return forced value on SSR', async () => {
    const Component = defineComponent({
      template: '{{ String(isDark) }}',
      setup() {
        const isDark = usePrefersDark();

        return { isDark };
      },
    });

    const contents = await renderToString(Component);
    expect(contents).toBe('null');
  });
});
