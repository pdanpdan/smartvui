// @vitest-environment node

import { renderToString } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { useRender } from '$lib/composables';

describe('useRender [node]', () => {
  describe('in isolation', () => {
    it('should throw error', () => {
      expect.soft(() => {
        const { render } = useRender();
        render(() => null);
      }).toThrowError('useRender\'s `render` can only be used on client side');
    });
  });

  describe('on SSR', () => {
    it('should throw error', async () => {
      const Component = defineComponent({
        template: '<div>{{ error }}</div>',
        setup() {
          let error = 'NONE';
          try {
            const { render } = useRender();
            render(() => null);
          } catch (err) {
            error = String(err);
          }

          return { error };
        },
      });

      expect.soft(await renderToString(Component)).toContain('useRender&#39;s `render` can only be used on client side');
    });
  });
});
