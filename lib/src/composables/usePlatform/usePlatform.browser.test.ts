// @vitest-environment happy-dom

import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';

import { usePlatform } from '$lib/composables';
import { SmartVui } from '$lib/index';
import { mockMatchMedia } from '$lib/test_utils/matchMediaMock';
import { stringify } from '$lib/test_utils/stringify';

describe('usePlatform [browser]', () => {
  const Component = defineComponent({
    template: '{{ platform }}',
    props: [ 'defaults' ],
    setup(props) {
      return { platform: usePlatform(props.defaults) };
    },
  });

  const ParentComponent = defineComponent({
    template: `parent={{ platform }}|child1=<Component :defaults="defaultsChild1" />|child2=<Component :defaults="defaultsChild2" />`,
    props: [ 'defaults', 'defaultsChild1', 'defaultsChild2' ],
    setup(props) {
      return { platform: usePlatform(props.defaults) };
    },
  });

  const nullDefault = {
    hasPointer: null,
    hasTouch: null,
    hasHover: null,
    isDesktop: null,
    isMobile: null,
    isStandalone: null,
    isEmulated: null,
    isAndroid: null,
    isIos: null,
    isLinux: null,
    isMacos: null,
    isWindows: null,
    isChromeos: null,
    isChrome: null,
    isFirefox: null,
    isSafari: null,
  };

  const falseAllDefault = {
    hasPointer: false,
    hasTouch: false,
    hasHover: false,
    isDesktop: false,
    isMobile: false,
    isStandalone: false,
    isEmulated: false,
    isAndroid: false,
    isIos: false,
    isLinux: false,
    isMacos: false,
    isWindows: false,
    isChromeos: false,
    isChrome: false,
    isFirefox: false,
    isSafari: false,
  };

  const mountOptions = {
    global: {
      plugins: [ [ SmartVui, { composables: [ usePlatform ] } ] ],
      components: { Component },
    },
  } as Parameters<typeof mount>[ 1 ];

  let dispatchMediaEvent: ReturnType<typeof mockMatchMedia>[ 'dispatchMediaQueryEvent' ];
  let matchMediaListeners: ReturnType<typeof mockMatchMedia>[ 'listeners' ];

  beforeEach(() => {
    const originalMatchMedia = window.matchMedia;
    const { matchMedia, setMediaQueryValue, dispatchMediaQueryEvent, listeners } = mockMatchMedia();
    window.matchMedia = matchMedia;
    dispatchMediaEvent = dispatchMediaQueryEvent;
    matchMediaListeners = listeners;
    setMediaQueryValue('screen and (any-pointer: none)', true);

    return () => {
      window.matchMedia = originalMatchMedia;
    };
  });

  it('should keep SSR values on mount', () => {
    const wrapper = mount(Component, {
      props: { defaults: { forceHasPointer: true } },
      ...mountOptions,
    });
    expect.soft(wrapper.text()).toBe(stringify({ ...nullDefault, hasPointer: true, hasHover: true }));
    wrapper.unmount();
  });

  it('should add listener on mount', () => {
    const wrapper1 = mount(Component, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(5);
    const wrapper2 = mount(ParentComponent, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(5);
    wrapper2.unmount();
    wrapper1.unmount();
  });

  it('should use browser values after mount', async () => {
    const wrapper = mount(Component, mountOptions);
    expect.soft(wrapper.text()).toBe(stringify(nullDefault));
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify({ ...falseAllDefault, isDesktop: true, isLinux: true }));
    wrapper.unmount();
  });

  it('should change values when mediaQuery changes', async () => {
    const wrapper = mount(Component, mountOptions);
    const expected = { ...falseAllDefault, isDesktop: true, isLinux: true };

    dispatchMediaEvent('screen and (any-hover: hover)', false);
    await nextTick();
    expected.hasHover = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (any-hover: hover)', true);
    await nextTick();
    expected.hasHover = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (any-pointer: fine)', true);
    await nextTick();
    expected.hasPointer = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (any-pointer: fine)', false);
    await nextTick();
    expected.hasPointer = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (any-pointer: coarse)', true);
    await nextTick();
    expected.hasTouch = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (any-pointer: coarse)', false);
    await nextTick();
    expected.hasTouch = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (any-pointer: none)', true);
    await nextTick();
    expected.hasHover = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (any-pointer: none)', false);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (display-mode: standalone)', true);
    await nextTick();
    expected.isStandalone = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    dispatchMediaEvent('screen and (display-mode: standalone)', false);
    await nextTick();
    expected.isStandalone = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    wrapper.unmount();
  });

  it('should change values based on userAgent', async () => {
    const expected = { ...falseAllDefault };

    const { navigator } = window;
    const userAgent = ref<string | null>(null);
    const userAgentData = ref<string | null>(null);
    const vendor = ref<string | null>(null);
    const maxTouchPoints = ref<number>(2);
    const standalone = ref<boolean>(false);

    window.navigator = new Proxy(navigator, {
      get(obj: Navigator, prop: string): unknown {
        if (prop === 'userAgent') {
          return userAgent.value;
        }

        if (prop === 'userAgentData') {
          return userAgentData.value;
        }

        if (prop === 'vendor') {
          return vendor.value;
        }

        if (prop === 'maxTouchPoints') {
          return maxTouchPoints.value;
        }

        if (prop === 'standalone') {
          return standalone.value;
        }

        return (obj as unknown as Record<string, unknown>)[ prop ];
      },
    });

    let wrapper = mount(Component, mountOptions);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    userAgent.value = 'iphone';
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expected.isMobile = true;
    expected.isIos = true;
    expected.isSafari = true;
    expected.hasTouch = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    vendor.value = '';
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expected.isEmulated = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    vendor.value = null;
    maxTouchPoints.value = 1;
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expected.isEmulated = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    maxTouchPoints.value = 0;
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    userAgent.value = 'android';
    maxTouchPoints.value = 2;
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expected.isIos = false;
    expected.isSafari = false;
    expected.isEmulated = false;
    expected.isAndroid = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    maxTouchPoints.value = 1;
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expected.isEmulated = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    maxTouchPoints.value = 0;
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    standalone.value = true;
    wrapper = mount(Component, mountOptions);
    await nextTick();
    expected.isStandalone = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    window.navigator = navigator;
  });

  it('should remove listener on unmount', () => {
    const wrapper1 = mount(Component, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(5);
    const wrapper2 = mount(ParentComponent, mountOptions);
    expect.soft(matchMediaListeners.length).toBe(5);
    wrapper2.unmount();
    expect.soft(matchMediaListeners.length).toBe(5);
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
    expect.soft(consoleWarnSpy).toHaveBeenCalledWith('[ SmartVui ] usePlatform was not installed. It will not work as a singleton.');
    wrapper.unmount();
    vi.restoreAllMocks();
  });
});
