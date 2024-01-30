import { beforeAll, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import { defineComponent, nextTick, ref } from 'vue';
import { usePlatform } from '..';

import { nullDefault } from './usePlatform.node.test';

declare global {
  interface Window {
    happyDOM: {
      settings: {
        navigator: Record<string, unknown>;
      };
    };
  }
}

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

function stringify(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

describe('should respect mediaQuery after mount', () => {
  const matchMediaListeners: ({ rule: string; listener: (evt: MediaQueryListEvent) => void })[] = [];
  const matchMediaCache: Record<string, MediaQueryList> = {};
  const matchMediaMock = (rule: string) => {
    if (matchMediaCache[ rule ] === undefined) {
      matchMediaCache[ rule ] = {
        media: '',
        matches: rule === 'screen and (any-pointer: none)',
        onchange: () => {},
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_: string, listener: (evt: MediaQueryListEvent) => void) => {
          matchMediaListeners.push({ rule, listener });
        },
        removeEventListener: (_: string, listener: (evt: MediaQueryListEvent) => void) => {
          const index = matchMediaListeners.findIndex((o) => o.rule === rule && o.listener === listener);

          if (index > -1) {
            matchMediaListeners.splice(index, 1);
          }
        },
        dispatchEvent: (evt: MediaQueryListEvent) => {
          matchMediaListeners.forEach((o) => {
            if (o.rule === rule) {
              o.listener(evt);
            }
          });
        },
      } as unknown as MediaQueryList;
    }

    return matchMediaCache[ rule ];
  };

  const Component = defineComponent({
    template: '{{ platform }}',
    setup() {
      return { platform: usePlatform() };
    },
  });

  beforeAll(() => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = matchMediaMock;

    return () => {
      window.matchMedia = originalMatchMedia;
    };
  });

  it('should keep SSR value on mount', () => {
    const wrapper = mount(Component);
    expect.soft(wrapper.text()).toBe(stringify(nullDefault));
    wrapper.unmount();
  });

  it('should add listener on mount', () => {
    const wrapper = mount(Component);
    expect.soft(matchMediaListeners.length).toBe(5);
    wrapper.unmount();
  });

  it('should use browser value after mount', async () => {
    const wrapper = mount(Component);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify({ ...falseAllDefault, isDesktop: true, isLinux: true }));
    wrapper.unmount();
  });

  it('should change value when mediaQuery changes', async () => {
    const wrapper = mount(Component);
    const expected = { ...falseAllDefault, isDesktop: true, isLinux: true };

    window.matchMedia('screen and (any-hover: hover)').dispatchEvent({ matches: false } as MediaQueryListEvent);
    await nextTick();
    expected.hasHover = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (any-hover: hover)').dispatchEvent({ matches: true } as MediaQueryListEvent);
    await nextTick();
    expected.hasHover = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (any-pointer: fine)').dispatchEvent({ matches: true } as MediaQueryListEvent);
    await nextTick();
    expected.hasPointer = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (any-pointer: fine)').dispatchEvent({ matches: false } as MediaQueryListEvent);
    await nextTick();
    expected.hasPointer = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (any-pointer: coarse)').dispatchEvent({ matches: true } as MediaQueryListEvent);
    await nextTick();
    expected.hasTouch = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (any-pointer: coarse)').dispatchEvent({ matches: false } as MediaQueryListEvent);
    await nextTick();
    expected.hasTouch = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (any-pointer: none)').dispatchEvent({ matches: true } as MediaQueryListEvent);
    await nextTick();
    expected.hasHover = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (any-pointer: none)').dispatchEvent({ matches: false } as MediaQueryListEvent);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (display-mode: standalone)').dispatchEvent({ matches: true } as MediaQueryListEvent);
    await nextTick();
    expected.isStandalone = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    window.matchMedia('screen and (display-mode: standalone)').dispatchEvent({ matches: false } as MediaQueryListEvent);
    await nextTick();
    expected.isStandalone = false;
    expect.soft(wrapper.text()).toBe(stringify(expected));

    wrapper.unmount();
  });

  it('should change value based on userAgent', async () => {
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

    let wrapper = mount(Component);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    userAgent.value = 'iphone';
    wrapper = mount(Component);
    await nextTick();
    expected.isMobile = true;
    expected.isIos = true;
    expected.isSafari = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    vendor.value = '';
    wrapper = mount(Component);
    await nextTick();
    expected.isEmulated = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    vendor.value = null;
    maxTouchPoints.value = 1;
    wrapper = mount(Component);
    await nextTick();
    expected.isEmulated = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    maxTouchPoints.value = 0;
    wrapper = mount(Component);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    userAgent.value = 'android';
    maxTouchPoints.value = 2;
    wrapper = mount(Component);
    await nextTick();
    expected.isIos = false;
    expected.isSafari = false;
    expected.isEmulated = false;
    expected.isAndroid = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    maxTouchPoints.value = 1;
    wrapper = mount(Component);
    await nextTick();
    expected.isEmulated = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    maxTouchPoints.value = 0;
    wrapper = mount(Component);
    await nextTick();
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    standalone.value = true;
    wrapper = mount(Component);
    await nextTick();
    expected.isStandalone = true;
    expect.soft(wrapper.text()).toBe(stringify(expected));
    wrapper.unmount();

    window.navigator = navigator;
  });

  it('should remove listener on unmount', () => {
    const wrapper = mount(Component);
    expect.soft(matchMediaListeners.length).toBe(5);
    wrapper.unmount();
    expect.soft(matchMediaListeners.length).toBe(0);
  });
});
