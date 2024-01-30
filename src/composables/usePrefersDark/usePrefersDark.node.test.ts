// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { renderToString } from '@vue/test-utils';

import { defineComponent, ref } from 'vue';
import { usePrefersDark } from '..';

describe('should return value', () => {
  it('should return forced fixed value', () => {
    expect.soft(usePrefersDark().value).toBe(null);
    expect.soft(usePrefersDark(null).value).toBe(null);
    expect.soft(usePrefersDark(true).value).toBe(true);
    expect.soft(usePrefersDark(false).value).toBe(false);
  });

  it('should return forced reactive value', () => {
    const forceDark = ref<boolean | null>(null);
    const isDark = usePrefersDark(forceDark);

    expect.soft(isDark.value).toBe(null);

    forceDark.value = true;
    expect.soft(isDark.value).toBe(true);

    forceDark.value = false;
    expect.soft(isDark.value).toBe(false);
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
    expect.soft(contents).toBe('null');
  });
});
