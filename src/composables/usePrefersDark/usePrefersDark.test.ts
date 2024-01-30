import { beforeAll, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import { defineComponent, nextTick } from 'vue';
import { usePrefersDark } from '..';

describe('should respect mediaQuery after mount', () => {
  const matchMediaListeners: ((evt: MediaQueryListEvent) => void)[] = [];
  const matchMediaMock = {
    media: '',
    matches: false,
    onchange: () => {},
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (_: string, listener: (evt: MediaQueryListEvent) => void) => {
      matchMediaListeners.push(listener);
    },
    removeEventListener: (_: string, listener: (evt: MediaQueryListEvent) => void) => {
      const index = matchMediaListeners.indexOf(listener);

      if (index > -1) {
        matchMediaListeners.splice(index, 1);
      }
    },
    dispatchEvent: (evt: MediaQueryListEvent) => {
      matchMediaListeners.forEach((listener) => {
        listener(evt);
      });
    },
  };

  const Component = defineComponent({
    template: '{{ String(isDark) }}',
    setup() {
      const isDark = usePrefersDark();

      return { isDark };
    },
  });

  beforeAll(() => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (_) => matchMediaMock as unknown as MediaQueryList;

    return () => {
      window.matchMedia = originalMatchMedia;
    };
  });

  it('should keep SSR value on mount', () => {
    const wrapper = mount(Component);
    expect.soft(wrapper.text()).toBe('null');
    wrapper.unmount();
  });

  it('should add listener on mount', () => {
    const wrapper = mount(Component);
    expect.soft(matchMediaListeners.length).toBe(1);
    wrapper.unmount();
  });

  it('should use browser value after mount', async () => {
    const wrapper = mount(Component);
    await nextTick();
    expect.soft(wrapper.text()).toBe('false');
    wrapper.unmount();
  });

  it('should change value when mediaQuery changes', async () => {
    const wrapper = mount(Component);
    window.matchMedia('').dispatchEvent({ matches: true } as MediaQueryListEvent);
    await nextTick();
    expect.soft(wrapper.text()).toBe('true');
    wrapper.unmount();
  });

  it('should remove listener on unmount', () => {
    const wrapper = mount(Component);
    expect.soft(matchMediaListeners.length).toBe(1);
    wrapper.unmount();
    expect.soft(matchMediaListeners.length).toBe(0);
  });
});
