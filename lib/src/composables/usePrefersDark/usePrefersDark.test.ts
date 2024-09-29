import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { usePrefersDark } from '$lib/composables';
import { SmartVui } from '$lib/index';
import { mockMatchMedia } from '$lib/test_utils/matchMediaMock';

describe('usePrefersDark [browser]', () => {
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

  const mountOptions = {
    global: {
      plugins: [ [ SmartVui, { composables: [ usePrefersDark ] } ] ],
      components: { Component },
    },
  } as Parameters<typeof mount>[ 1 ];

  let dispatchMediaEvent: ReturnType<typeof mockMatchMedia>[ 'dispatchMediaQueryEvent' ];
  let matchMediaListeners: ReturnType<typeof mockMatchMedia>[ 'listeners' ];

  beforeEach(() => {
    const originalMatchMedia = window.matchMedia;
    const { matchMedia, dispatchMediaQueryEvent, listeners } = mockMatchMedia();
    window.matchMedia = matchMedia;
    dispatchMediaEvent = dispatchMediaQueryEvent;
    matchMediaListeners = listeners;

    return () => {
      window.matchMedia = originalMatchMedia;
    };
  });

  it('should keep SSR value on mount', () => {
    const wrapper = mount(Component, {
      props: { defaults: true },
      ...mountOptions,
    });
    expect.soft(wrapper.text()).toBe('true');
    wrapper.unmount();
  });

  it('should add listener on mount', () => {
    const wrapper1 = mount(Component, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(1);
    const wrapper2 = mount(ParentComponent, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(1);
    wrapper2.unmount();
    wrapper1.unmount();
  });

  it('should use browser value after mount', async () => {
    const wrapper = mount(Component, mountOptions);
    expect.soft(wrapper.text()).toBe('null');
    await nextTick();
    expect.soft(wrapper.text()).toBe('false');
    wrapper.unmount();
  });

  it('should change value when mediaQuery changes', async () => {
    const wrapper = mount(Component, mountOptions);
    dispatchMediaEvent('screen and (prefers-color-scheme: dark)', true);
    await nextTick();
    expect.soft(wrapper.text()).toBe('true');
    wrapper.unmount();
  });

  it('should remove listener on unmount', () => {
    const wrapper1 = mount(Component, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(1);
    const wrapper2 = mount(ParentComponent, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(1);
    wrapper2.unmount();
    expect.soft(matchMediaListeners.length).toBe(1);
    wrapper1.unmount();
    expect.soft(matchMediaListeners.length).toBe(0);
  });

  it('should not warn if installed', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn');
    const wrapper = mount(Component, mountOptions);
    expect.soft(consoleWarnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
    vi.restoreAllMocks();
  });

  it('should warn if not installed', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(Component);
    expect.soft(consoleWarnSpy).toHaveBeenCalledWith('[ SmartVui ] usePrefersDark was not installed. It will not work as a singleton.');
    wrapper.unmount();
    vi.restoreAllMocks();
  });
});
