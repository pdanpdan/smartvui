// @vitest-environment node

import { renderToString } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';

import { usePrefersDark } from '$lib/composables';
import { SmartVui } from '$lib/index';

describe('usePrefersDark [node]', () => {
  describe('in isolation', () => {
    it('should return default value', () => {
      expect.soft(usePrefersDark().isDark.value).toBe(null);
    });

    it('should return forced fixed value', () => {
      expect.soft(usePrefersDark({ forceDark: null }).isDark.value).toBe(null);
      expect.soft(usePrefersDark({ forceDark: true }).isDark.value).toBe(true);
      expect.soft(usePrefersDark({ forceDark: false }).isDark.value).toBe(false);
    });

    it('should return forced reactive value', () => {
      const { isDark, forceDark } = usePrefersDark();

      expect.soft(isDark.value).toBe(null);

      forceDark.value = true;
      expect.soft(isDark.value).toBe(true);

      forceDark.value = false;
      expect.soft(isDark.value).toBe(false);
    });
  });

  describe('on SSR', () => {
    const Component = defineComponent({
      template: '{{ String(isDark) }}',
      props: [ 'defaults', 'group' ],
      setup(props) {
        const { isDark, forceDark } = usePrefersDark({ group: props.group });
        if (props.defaults !== undefined) {
          forceDark.value = props.defaults;
        }
        return { isDark };
      },
    });

    const ParentComponent = defineComponent({
      template: `parent={{ String(isDark) }}|child1=<Component :defaults="defaultsChild1" :group="group1" />|child2=<Component :defaults="defaultsChild2" :group="group2" />`,
      props: [ 'defaults', 'defaultsChild1', 'defaultsChild2', 'group', 'group1', 'group2' ],
      setup(props) {
        const { isDark, forceDark } = usePrefersDark({ group: props.group });
        if (props.defaults !== undefined) {
          forceDark.value = props.defaults;
        }
        return { isDark };
      },
    });

    const renderToStringOptions = {
      global: {
        plugins: [ [ SmartVui, { composables: [ usePrefersDark ] } ] ],
        components: { Component },
      },
    } as Parameters<typeof renderToString>[ 1 ];

    it('should return forced value', async () => {
      const forceDark = ref<boolean | null>(null);

      expect.soft(await renderToString(Component, {
        props: { defaults: forceDark.value },
        ...renderToStringOptions,
      })).toBe('null');

      forceDark.value = false;
      expect.soft(await renderToString(Component, {
        props: { defaults: forceDark.value },
        ...renderToStringOptions,
      })).toBe('false');

      forceDark.value = true;
      expect.soft(await renderToString(Component, {
        props: { defaults: forceDark.value },
        ...renderToStringOptions,
      })).toBe('true');
    });

    it('should reuse options if called from multiple components in the same group', async () => {
      const text = 'true';
      expect.soft(await renderToString(ParentComponent, {
        props: { defaults: true },
        ...renderToStringOptions,
      })).toContain(`parent=${ text }|child1=${ text }|child2=${ text }`);

      expect.soft(await renderToString(ParentComponent, {
        props: {
          defaults: true,
        },
        ...renderToStringOptions,
      })).toContain(`parent=${ text }|child1=${ text }|child2=${ text }`);

      const textNull = 'null';
      expect.soft(await renderToString(ParentComponent, {
        props: {
          defaultsChild1: true,
        },
        ...renderToStringOptions,
      })).toContain(`parent=${ textNull }|child1=${ text }|child2=${ text }`);
    });

    it('should not reuse options if called in different groups', async () => {
      const textTrue = 'true';
      const textNull = 'null';
      expect.soft(await renderToString(ParentComponent, {
        props: {
          defaults: true,
          defaultsChild1: null,
          group1: 'otherGroup',
          group2: 'otherGroup',
        },
        ...renderToStringOptions,
      })).toContain(`parent=${ textTrue }|child1=${ textNull }|child2=${ textNull }`);
    });

    it('should not warn if installed', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      await renderToString(Component, renderToStringOptions);
      expect.soft(consoleWarnSpy).not.toHaveBeenCalled();
      vi.restoreAllMocks();
    });

    it('should warn if not installed', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      await renderToString(Component);
      expect.soft(consoleWarnSpy).toHaveBeenCalledWith('[ SmartVui ] usePrefersDark was not installed. It will not work as a singleton.');
      vi.restoreAllMocks();
    });
  });
});
