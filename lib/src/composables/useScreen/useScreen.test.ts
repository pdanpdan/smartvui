import type { MockInstance } from 'vitest';

import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { usePlatform, useScreen } from '$lib/composables';
import { SmartVui } from '$lib/index';
import { stringify } from '$lib/test_utils/stringify';

type VisualViewportWritable = Partial<{ -readonly [ K in keyof VisualViewport ]: VisualViewport[ K ] }>;

function createScreenDefault({ width = 1280, height = 960, viewHeight = null as number | null, scrollTop = 0, scrollLocked = false } = {}) {
  return {
    pageInlineSize: width,
    pageBlockSize: height,
    screenInlineSize: width,
    screenBlockSize: height,
    viewInlineSize: width,
    viewBlockSize: viewHeight ?? height,
    viewScale: 1,
    scrollInlineGutter: 0,
    scrollBlockGutter: 0,
    pageInlineStart: 0,
    pageBlockStart: scrollTop,
    virtualKeyboardOpen: false,
    scrollLocked: scrollLocked === true,
    scrollLockRequested: scrollLocked === true,
  };
}

describe('useScreen [browser]', () => {
  const Component = defineComponent({
    template: '{{ screen }}',
    props: [ 'defaults' ],
    setup(props) {
      return { screen: useScreen(props.defaults) };
    },
  });

  const ParentComponent = defineComponent({
    template: `parent={{ platform }}|child1=<Component :defaults="defaultsChild1" />|child2=<Component :defaults="defaultsChild2" />`,
    props: [ 'defaults', 'defaultsChild1', 'defaultsChild2' ],
    setup(props) {
      return { platform: useScreen(props.defaults) };
    },
  });

  const mountOptions = {
    global: {
      plugins: [ [ SmartVui, { composables: [ usePlatform, useScreen ] } ] ],
      components: { Component },
    },
  } as Parameters<typeof mount>[ 1 ];

  const executeBeforeEach = (userAgent: string = 'Chrome') => () => {
    vi.useFakeTimers();

    happyDOM.settings.navigator.userAgent = userAgent;
    happyDOM.setViewport({ width: 1024, height: 768 });

    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');

    vi.spyOn(window, 'scrollBy').mockImplementation((options?: ScrollToOptions | number, y?: number): void => {
      const left = options && typeof options !== 'number' ? options.left : options;
      const top = options && typeof options !== 'number' ? options.top : y;
      window.scroll({
        left: document.documentElement.scrollLeft + (left ?? 0),
        top: document.documentElement.scrollTop + (top ?? 0),
      });
      window.dispatchEvent(new Event('scroll'));
    });

    vi.spyOn(window, 'scrollTo').mockImplementation((options?: ScrollToOptions | number, y?: number): void => {
      const left = options && typeof options !== 'number' ? options.left : options;
      const top = options && typeof options !== 'number' ? options.top : y;
      window.scroll({
        left: left ?? document.documentElement.scrollLeft,
        top: top ?? document.documentElement.scrollTop,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    let orientationType: OrientationType = 'landscape-primary';
    type OrientationListener = (evt: DeviceOrientationEvent) => unknown;
    const orientationListeners: OrientationListener[] = [];
    Object.defineProperty(screen, 'orientation', {
      writable: false,
      configurable: true,
      value: {
        angle: 0,
        onchange: null,
        addEventListener: vi.fn((_type: 'change', listener: OrientationListener, _options?: boolean | AddEventListenerOptions): void => {
          orientationListeners.push(listener);
        }),
        removeEventListener: vi.fn((_type: 'change', listener: OrientationListener, _options?: boolean | EventListenerOptions): void => {
          const foundIndex = orientationListeners.indexOf(listener);
          if (foundIndex > -1) {
            orientationListeners.splice(foundIndex, 1);
          }
        }),
      },
    });
    Object.defineProperty(screen.orientation, 'type', {
      configurable: true,
      get() {
        return orientationType;
      },

      set(newValue) {
        orientationType = newValue;
        const ev = new DeviceOrientationEvent('change');
        orientationListeners.forEach((l) => {
          l(ev);
        });
      },
    });

    type VKeyboardListener = (evt: Event) => unknown;
    const vKeyboardListeners: VKeyboardListener[] = [];
    Object.defineProperty(navigator, 'virtualKeyboard', {
      writable: false,
      configurable: true,
      value: {
        addEventListener: vi.fn((_type: 'geometrychange', listener: VKeyboardListener, _options?: boolean | AddEventListenerOptions): void => {
          vKeyboardListeners.push(listener);
        }),
        removeEventListener: vi.fn((_type: 'geometrychange', listener: VKeyboardListener, _options?: boolean | EventListenerOptions): void => {
          const foundIndex = vKeyboardListeners.indexOf(listener);
          if (foundIndex > -1) {
            vKeyboardListeners.splice(foundIndex, 1);
          }
        }),
      },
    });

    const vieportState = {
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      width: null,
      height: null,
      scale: 1,
    } as { -readonly [ K in keyof VisualViewport ]: number | null };
    type ViewportListener<K extends keyof VisualViewportEventMap> = (evt: VisualViewportEventMap[ K ]) => unknown;
    const viewportListeners = {
      resize: [],
      scroll: [],
    } as {
      [ K in keyof VisualViewportEventMap ]: ViewportListener<K>[];
    };
    Object.defineProperty(window, 'visualViewport', {
      writable: false,
      configurable: true,
      value: {
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: null,
        pageTop: null,
        width: null,
        height: null,
        scale: 1,
        onresize: null,
        onscroll: null,
        onscrollend: null,
        addEventListener: vi.fn(<K extends keyof VisualViewportEventMap>(type: K, listener: ViewportListener<K>, _options?: boolean | AddEventListenerOptions): void => {
          viewportListeners[ type ].push(listener);
        }),
        removeEventListener: vi.fn(<K extends keyof VisualViewportEventMap>(type: K, listener: ViewportListener<K>, _options?: boolean | EventListenerOptions): void => {
          const foundIndex = viewportListeners[ type ].indexOf(listener);
          if (foundIndex > -1) {
            viewportListeners[ type ].splice(foundIndex, 1);
          }
        }),
      },
    });
    const propsMap: [ keyof VisualViewportEventMap, Array<keyof VisualViewport> ][] = [
      [ 'resize', [ 'width', 'height', 'scale' ] ],
      [ 'scroll', [ 'offsetLeft', 'offsetTop', 'pageLeft', 'pageTop' ] ],
    ];
    propsMap.forEach(([ type, props ]) => {
      props.forEach((prop) => {
        Object.defineProperty(window.visualViewport, prop, {
          get() {
            if (prop === 'width') {
              return vieportState[ prop ] ?? window.innerWidth;
            }
            if (prop === 'height') {
              return vieportState[ prop ] ?? window.innerHeight;
            }
            if (prop === 'pageLeft') {
              return vieportState[ prop ] ?? document.documentElement.scrollLeft;
            }
            if (prop === 'pageTop') {
              return vieportState[ prop ] ?? document.documentElement.scrollTop;
            }
            return vieportState[ prop ];
          },

          set(newValue) {
            vieportState[ prop ] = newValue;
            const ev = new Event(type);
            viewportListeners[ type ].forEach((l) => {
              l(ev);
            });
          },
        });
      });
    });

    ([ 'clientWidth', 'offsetWidth', 'scrollWidth' ]).forEach((prop) => {
      Object.defineProperty(document.documentElement, prop, {
        configurable: true,
        get() {
          return window.innerWidth;
        },
      });
    });

    ([ 'clientHeight', 'offsetHeight', 'scrollHeight' ]).forEach((prop) => {
      Object.defineProperty(document.documentElement, prop, {
        configurable: true,
        get() {
          return window.innerHeight;
        },
      });
    });

    window.scrollTo(0, 0);

    return async () => {
      await vi.runAllTimersAsync();
      vi.restoreAllMocks();
      vi.useRealTimers();
    };
  };

  type MockedAddEventListener = MockInstance<typeof window.addEventListener>;

  describe('on all platforms', () => {
    beforeEach(executeBeforeEach('???'));

    it('should keep SSR values on mount', () => {
      const wrapper = mount(Component, {
        props: { defaults: { width: 800, height: 400 } },
        ...mountOptions,
      });
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 800, height: 400 })));
      wrapper.unmount();
    });

    it('should add listener on mount', () => {
      const wrapper1 = mount(Component, mountOptions);
      expect.soft(window.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 0 ][ 0 ]).toEqual('resize');
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 1 ][ 0 ]).toEqual('scroll');

      expect.soft(screen.orientation.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft((screen.orientation.addEventListener as unknown as MockInstance<typeof screen.orientation.addEventListener>).mock.calls[ 0 ][ 0 ]).toEqual('change');

      const vk = (navigator as Navigator & {
        virtualKeyboard: {
          addEventListener: (_type: 'geometrychange', listener: (evt: Event) => unknown, _options?: boolean | AddEventListenerOptions) => void;
        };
      }).virtualKeyboard;
      expect.soft(vk.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft((vk.addEventListener as unknown as MockInstance<typeof vk.addEventListener>).mock.calls[ 0 ][ 0 ]).toEqual('geometrychange');

      expect.soft(window.visualViewport?.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft((window.visualViewport?.addEventListener as unknown as MockedAddEventListener).mock.calls[ 0 ][ 0 ]).toEqual('resize');
      expect.soft((window.visualViewport?.addEventListener as unknown as MockedAddEventListener).mock.calls[ 1 ][ 0 ]).toEqual('scroll');

      const wrapper2 = mount(ParentComponent, mountOptions);
      expect.soft(window.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft(screen.orientation.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft(window.visualViewport?.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft(vk.addEventListener).toHaveBeenCalledTimes(1);

      wrapper2.unmount();
      wrapper1.unmount();
    });

    it('should remove listener on unmount', () => {
      const wrapper1 = mount(Component, mountOptions);
      const wrapper2 = mount(ParentComponent, mountOptions);

      wrapper2.unmount();
      expect.soft(window.removeEventListener).toHaveBeenCalledTimes(0);
      expect.soft(screen.orientation.removeEventListener).toHaveBeenCalledTimes(0);
      expect.soft(window.visualViewport?.removeEventListener).toHaveBeenCalledTimes(0);
      const vk = (navigator as Navigator & {
        virtualKeyboard: {
          removeEventListener: (_type: 'geometrychange', listener: (evt: Event) => unknown, _options?: boolean | EventListenerOptions) => void;
        };
      }).virtualKeyboard;
      expect.soft(vk.removeEventListener).toHaveBeenCalledTimes(0);

      wrapper1.unmount();
      expect.soft(window.removeEventListener).toHaveBeenCalledTimes(2);
      expect.soft(screen.orientation.removeEventListener).toHaveBeenCalledTimes(1);
      expect.soft(window.visualViewport?.removeEventListener).toHaveBeenCalledTimes(2);
      expect.soft(vk.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('should use browser values after mount', async () => {
      const wrapper = mount(Component, {
        props: { defaults: { width: 800, height: 400 } },
        ...mountOptions,
      });
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 800, height: 400 })));
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 768 })));
      wrapper.unmount();
    });

    it('should update after events', async () => {
      const wrapper = mount(Component, mountOptions);
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 768 })));
      happyDOM.setViewport({ height: 100 });
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 100 })));
      wrapper.unmount();
    });

    it('should throttle updates after events', async () => {
      const wrapper = mount(Component, mountOptions);
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 768 })));

      happyDOM.setViewport({ height: 100 });
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 100 })));

      happyDOM.setViewport({ height: 200 });
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 100 })));

      happyDOM.setViewport({ height: 300 });
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 100 })));

      await vi.advanceTimersToNextTimerAsync();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 300 })));
      wrapper.unmount();
    });

    it('should mount with screen locked', () => {
      const { scrollLockRequested } = useScreen();

      scrollLockRequested.value = true;

      const wrapper = mount(Component, mountOptions);
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked');

      scrollLockRequested.value = false;
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      wrapper.unmount();
    });

    it('should not lock multiple times', () => {
      const LockingComponent = defineComponent({
        template: 'Test',
        setup() {
          const { scrollLockRequested } = useScreen();
          scrollLockRequested.value = true;

          return {};
        },
      });

      const wrapper1 = mount(LockingComponent, mountOptions);
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked');

      const wrapper2 = mount(LockingComponent, mountOptions);
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked');

      wrapper1.unmount();
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked');

      wrapper2.unmount();
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');
    });

    it('should unlock screen when unmounted', () => {
      const LockingComponent = defineComponent({
        template: 'Test',
        setup() {
          const { scrollLockRequested } = useScreen();
          scrollLockRequested.value = true;

          return {};
        },
      });

      const wrapper = mount(LockingComponent, mountOptions);
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked');

      wrapper.unmount();
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');
    });

    it('should not warn if installed', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      const wrapper = mount(Component, mountOptions);
      expect.soft(consoleWarnSpy).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it('should warn if not installed', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = mount(Component);
      expect.soft(consoleWarnSpy).toHaveBeenCalledWith('[ SmartVui ] usePlatform was not installed. It will not work as a singleton.');
      wrapper.unmount();
    });
  });

  describe('on iOS', () => {
    beforeEach(executeBeforeEach('IPhone'));

    it('should add listener on mount', () => {
      const wrapper1 = mount(Component, mountOptions);
      expect.soft(window.addEventListener).toHaveBeenCalledTimes(4);
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 0 ][ 0 ]).toEqual('resize');
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 1 ][ 0 ]).toEqual('scroll');
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 2 ][ 0 ]).toEqual('focusin');
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 3 ][ 0 ]).toEqual('focusout');

      expect.soft(screen.orientation.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft((screen.orientation.addEventListener as unknown as MockInstance<typeof screen.orientation.addEventListener>).mock.calls[ 0 ][ 0 ]).toEqual('change');

      expect.soft(window.visualViewport?.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft((window.visualViewport?.addEventListener as unknown as MockedAddEventListener).mock.calls[ 0 ][ 0 ]).toEqual('resize');
      expect.soft((window.visualViewport?.addEventListener as unknown as MockedAddEventListener).mock.calls[ 1 ][ 0 ]).toEqual('scroll');

      const wrapper2 = mount(ParentComponent, mountOptions);
      expect.soft(window.addEventListener).toHaveBeenCalledTimes(4);
      expect.soft(screen.orientation.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft(window.visualViewport?.addEventListener).toHaveBeenCalledTimes(2);

      wrapper2.unmount();
      wrapper1.unmount();
    });

    it('should remove listener on unmount', () => {
      const wrapper1 = mount(Component, mountOptions);
      const wrapper2 = mount(ParentComponent, mountOptions);

      wrapper2.unmount();
      expect.soft(window.removeEventListener).toHaveBeenCalledTimes(0);
      expect.soft(screen.orientation.removeEventListener).toHaveBeenCalledTimes(0);
      expect.soft(window.visualViewport?.removeEventListener).toHaveBeenCalledTimes(0);

      wrapper1.unmount();
      expect.soft(window.removeEventListener).toHaveBeenCalledTimes(4);
      expect.soft(screen.orientation.removeEventListener).toHaveBeenCalledTimes(1);
      expect.soft(window.visualViewport?.removeEventListener).toHaveBeenCalledTimes(2);
    });

    it('should update after events when scale changes', async () => {
      const wrapper = mount(Component, mountOptions);
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 768 })));
      happyDOM.setViewport({ height: 100 });
      (window.visualViewport as VisualViewportWritable).scale = 2;
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 100 })));
      wrapper.unmount();
    });

    it('should fix scroll position on top', async () => {
      const { pageBlockStart } = useScreen();
      const wrapper = mount(Component, mountOptions);
      (window.visualViewport as VisualViewportWritable).height = 700;

      window.scrollTo(0, -10);
      await vi.advanceTimersByTimeAsync(20);
      expect.soft(pageBlockStart.value).toBe(-10);

      await vi.advanceTimersByTimeAsync(150);
      expect.soft(pageBlockStart.value).toBeGreaterThan(-10);

      wrapper.unmount();
    });

    it('should fix scroll position on bottom', async () => {
      const { pageBlockStart } = useScreen();
      const wrapper = mount(Component, mountOptions);
      (window.visualViewport as VisualViewportWritable).height = 700;

      window.scrollTo(0, 100);
      await vi.advanceTimersByTimeAsync(20);
      expect.soft(pageBlockStart.value).toBe(100);

      await vi.advanceTimersByTimeAsync(150);
      expect.soft(pageBlockStart.value).toBeLessThan(100);

      wrapper.unmount();
    });

    it('should not fix scroll position when not needed', async () => {
      const { pageBlockStart } = useScreen();
      const wrapper = mount(Component, mountOptions);
      (window.visualViewport as VisualViewportWritable).height = 700;

      window.scrollTo(0, 10);
      await vi.advanceTimersByTimeAsync(20);
      expect.soft(pageBlockStart.value).toBe(10);

      await vi.advanceTimersByTimeAsync(150);
      expect.soft(pageBlockStart.value).toBe(10);

      wrapper.unmount();
    });

    it('should lock and unlock screen', () => {
      const { scrollLockRequested } = useScreen();

      const wrapper = mount(Component, mountOptions);
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked', 'ios');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked', 'ios');

      scrollLockRequested.value = false;
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      wrapper.unmount();
    });

    it('should detect virtual keyboard', () => {
      const { virtualKeyboardOpen } = useScreen();
      const EditableComponent = defineComponent({
        template: '<input class="input" type="text" />',
        setup() {
          return { screen: useScreen() };
        },
      });

      const wrapper = mount(EditableComponent, mountOptions);

      const target = wrapper.get('.input');
      window.dispatchEvent({ type: 'focusin', target: target.element, composedPath: () => [] as EventTarget[] } as unknown as Event);
      expect.soft(virtualKeyboardOpen.value).toBe(true);

      window.dispatchEvent({ type: 'focusout', target: target.element, composedPath: () => [] as EventTarget[] } as unknown as Event);
      expect.soft(virtualKeyboardOpen.value).toBe(false);

      wrapper.unmount();
    });

    it('should scroll anchored editable elements in view on focus', async () => {
      const { pageBlockStart } = useScreen();
      const EditableComponent = defineComponent({
        template: '<input class="input" />',
        setup() {
          return { screen: useScreen() };
        },
      });

      const wrapper = mount(EditableComponent, {
        ...mountOptions,
        attachTo: document.body,
      });
      const { getComputedStyle } = window;
      window.getComputedStyle = vi.fn((el) => ({ ...getComputedStyle(el), position: 'fixed' })) as unknown as typeof window.getComputedStyle;

      window.scrollTo(0, 50);
      expect.soft(pageBlockStart.value).toBe(50);

      const target = wrapper.get('.input');

      const getBoundingClientRect = vi.spyOn(target.element, 'getBoundingClientRect');
      getBoundingClientRect.mockImplementation(() => ({ top: 1000, bottom: 1200 }) as DOMRect);

      (target.element as HTMLElement).focus();
      expect.soft((document.activeElement as HTMLElement)?.dataset.svIosFocusFixTarget).toBeUndefined();

      await vi.advanceTimersByTimeAsync(300);
      expect.soft(document.activeElement).toBe(target.element);

      wrapper.unmount();
      window.getComputedStyle = getComputedStyle;
    });

    it('should not scroll anchored editable elements in view on focus if requested not to', async () => {
      const { pageBlockStart } = useScreen();
      const EditableComponent = defineComponent({
        template: '<input class="input" type="text" data-sv-no-focus-fix />',
        setup() {
          return { screen: useScreen() };
        },
      });

      const wrapper = mount(EditableComponent, {
        ...mountOptions,
        attachTo: document.body,
      });
      const { getComputedStyle } = window;
      window.getComputedStyle = vi.fn((el) => ({ ...getComputedStyle(el), position: 'fixed' })) as unknown as typeof window.getComputedStyle;

      window.scrollTo(0, 50);
      expect.soft(pageBlockStart.value).toBe(50);

      const target = wrapper.get('.input');

      const getBoundingClientRect = vi.spyOn(target.element, 'getBoundingClientRect');
      getBoundingClientRect.mockImplementation(() => ({ top: 1000, bottom: 1200 }) as DOMRect);

      (target.element as HTMLElement).focus();
      expect.soft(document.activeElement).toBe(target.element);

      await vi.advanceTimersByTimeAsync(300);
      expect.soft(pageBlockStart.value).toBe(50);

      (target.element as HTMLElement).blur();
      window.scrollTo(0, 50);
      await vi.advanceTimersByTimeAsync(300);

      expect.soft(document.activeElement).not.toBe(target.element);
      expect.soft(pageBlockStart.value).toBe(50);
      getBoundingClientRect.mockImplementation(() => ({ top: -100, bottom: -50 }) as DOMRect);

      (target.element as HTMLElement).focus();
      expect.soft(document.activeElement).toBe(target.element);

      await vi.advanceTimersByTimeAsync(300);
      expect.soft(pageBlockStart.value).toBe(50);

      wrapper.unmount();
      window.getComputedStyle = getComputedStyle;
    });

    it('should scroll anchored editable elements in view on focus when animating container', () => {
      const { virtualKeyboardOpen } = useScreen();
      const EditableComponent = defineComponent({
        template: '<div data-sv-surface-animating><input class="input" type="text" /></div>',
        setup() {
          return { screen: useScreen() };
        },
      });

      const wrapper = mount(EditableComponent, mountOptions);
      const { getComputedStyle } = window;
      window.getComputedStyle = vi.fn((el) => ({ ...getComputedStyle(el), position: 'fixed' })) as unknown as typeof window.getComputedStyle;

      const target = wrapper.get('.input');

      window.dispatchEvent({ type: 'focusin', target: target.element, composedPath: () => [] as EventTarget[] } as unknown as Event);
      expect.soft(virtualKeyboardOpen.value).toBe(true);

      wrapper.unmount();
      window.getComputedStyle = getComputedStyle;
    });
  });

  describe('on Android', () => {
    beforeEach(executeBeforeEach('Android'));

    it('should add listener on mount', () => {
      const wrapper1 = mount(Component, mountOptions);
      expect.soft(window.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 0 ][ 0 ]).toEqual('resize');
      expect.soft((window.addEventListener as unknown as MockedAddEventListener).mock.calls[ 1 ][ 0 ]).toEqual('scroll');

      expect.soft(screen.orientation.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft((screen.orientation.addEventListener as unknown as MockInstance<typeof screen.orientation.addEventListener>).mock.calls[ 0 ][ 0 ]).toEqual('change');

      const vk = (navigator as Navigator & {
        virtualKeyboard: {
          addEventListener: (_type: 'geometrychange', listener: (evt: Event) => unknown, _options?: boolean | AddEventListenerOptions) => void;
        };
      }).virtualKeyboard;
      expect.soft(vk.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft((vk.addEventListener as unknown as MockInstance<typeof vk.addEventListener>).mock.calls[ 0 ][ 0 ]).toEqual('geometrychange');

      expect.soft(window.visualViewport?.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft((window.visualViewport?.addEventListener as unknown as MockedAddEventListener).mock.calls[ 0 ][ 0 ]).toEqual('resize');
      expect.soft((window.visualViewport?.addEventListener as unknown as MockedAddEventListener).mock.calls[ 1 ][ 0 ]).toEqual('scroll');

      const wrapper2 = mount(ParentComponent, mountOptions);
      expect.soft(window.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft(screen.orientation.addEventListener).toHaveBeenCalledTimes(1);
      expect.soft(window.visualViewport?.addEventListener).toHaveBeenCalledTimes(2);
      expect.soft(vk.addEventListener).toHaveBeenCalledTimes(1);

      wrapper2.unmount();
      wrapper1.unmount();
    });

    it('should remove listener on unmount', () => {
      const wrapper1 = mount(Component, mountOptions);
      const wrapper2 = mount(ParentComponent, mountOptions);

      wrapper2.unmount();
      expect.soft(window.removeEventListener).toHaveBeenCalledTimes(0);
      expect.soft(screen.orientation.removeEventListener).toHaveBeenCalledTimes(0);
      expect.soft(window.visualViewport?.removeEventListener).toHaveBeenCalledTimes(0);
      const vk = (navigator as Navigator & {
        virtualKeyboard: {
          removeEventListener: (_type: 'geometrychange', listener: (evt: Event) => unknown, _options?: boolean | EventListenerOptions) => void;
        };
      }).virtualKeyboard;
      expect.soft(vk.removeEventListener).toHaveBeenCalledTimes(0);

      wrapper1.unmount();
      expect.soft(window.removeEventListener).toHaveBeenCalledTimes(2);
      expect.soft(screen.orientation.removeEventListener).toHaveBeenCalledTimes(1);
      expect.soft(window.visualViewport?.removeEventListener).toHaveBeenCalledTimes(2);
      expect.soft(vk.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('should update after events without visualViewport', async () => {
      Object.defineProperty(window, 'visualViewport', {
        writable: false,
        configurable: true,
        value: undefined,
      });

      const wrapper = mount(Component, mountOptions);
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 768 })));
      happyDOM.setViewport({ height: 100 });
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 100 })));
      wrapper.unmount();
    });

    it('should lock and unlock screen', () => {
      const { scrollLockRequested } = useScreen();

      const wrapper = mount(Component, mountOptions);
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked', 'android');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked', 'android');

      scrollLockRequested.value = false;
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      wrapper.unmount();
    });

    it('should detect virtual keyboard', () => {
      const { virtualKeyboardOpen } = useScreen();
      const wrapper = mount(Component, mountOptions);

      (window.visualViewport as VisualViewportWritable).height = 500;
      window.dispatchEvent(new Event('resize'));
      expect.soft(virtualKeyboardOpen.value).toBe(true);

      wrapper.unmount();
    });
  });

  describe('on Desktop', () => {
    beforeEach(executeBeforeEach('Chrome'));

    it('should update after events without visualViewport', async () => {
      Object.defineProperty(window, 'visualViewport', {
        writable: false,
        configurable: true,
        value: undefined,
      });

      const wrapper = mount(Component, mountOptions);
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 768 })));
      happyDOM.setViewport({ height: 100 });
      await nextTick();
      expect.soft(wrapper.text()).toBe(stringify(createScreenDefault({ width: 1024, height: 100 })));
      wrapper.unmount();
    });

    it('should lock and unlock screen', () => {
      const { scrollLockRequested } = useScreen();

      const wrapper = mount(Component, mountOptions);
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked', 'desktop');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLocked', 'desktop');

      scrollLockRequested.value = false;
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      wrapper.unmount();
    });

    it('should detect scroll gutter on lock', () => {
      const { scrollLockRequested } = useScreen();

      Object.defineProperty(document.documentElement, 'clientWidth', {
        configurable: true,
        get() {
          return window.innerWidth - 16;
        },
      });

      const wrapper = mount(Component, mountOptions);
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLocked');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLockedGutter');

      scrollLockRequested.value = true;
      expect.soft(document.documentElement.dataset).toHaveProperty('svScrollLockedGutter');

      scrollLockRequested.value = false;
      expect.soft(document.documentElement.dataset).not.toHaveProperty('svScrollLockedGutter');

      wrapper.unmount();
    });
  });
});

describe('onScrollUnlocked', () => {
  const mountOptions = {
    global: {
      plugins: [ [ SmartVui, { composables: [ usePlatform, useScreen ] } ] ],
    },
  } as Parameters<typeof mount>[ 1 ];

  it('should execute function if unlocked', () => {
    const fn = vi.fn();
    const Component = defineComponent({
      template: 'Test',
      setup() {
        const { onScrollUnlocked } = useScreen();
        onScrollUnlocked(fn);
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(fn).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('should not execute function if locked', () => {
    const fn = vi.fn();
    const Component = defineComponent({
      template: 'Test',
      setup() {
        const { onScrollUnlocked, scrollLockRequested } = useScreen();
        scrollLockRequested.value = true;
        onScrollUnlocked(fn);
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(fn).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should execute function after unlock', async () => {
    const fn = vi.fn();
    const Component = defineComponent({
      template: 'Test',
      setup() {
        const { onScrollUnlocked, scrollLockRequested } = useScreen();
        scrollLockRequested.value = true;
        onScrollUnlocked(fn);
        nextTick().then(() => {
          scrollLockRequested.value = false;
        });
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(fn).not.toHaveBeenCalled();

    await nextTick();
    expect.soft(fn).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('should not execute function after unlock if queue is cleared', async () => {
    const fn = vi.fn();
    const Component = defineComponent({
      template: 'Test',
      setup() {
        const { onScrollUnlocked, onScrollUnlockedClear, scrollLockRequested } = useScreen();
        scrollLockRequested.value = true;
        onScrollUnlocked(fn);
        nextTick().then(() => {
          onScrollUnlockedClear(true);
          scrollLockRequested.value = false;
        });
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(fn).not.toHaveBeenCalled();

    await nextTick();
    expect.soft(fn).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should not execute unqueued function after unlock', async () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const Component = defineComponent({
      template: 'Test',
      setup() {
        const { onScrollUnlocked, onScrollUnlockedClear, scrollLockRequested } = useScreen();
        scrollLockRequested.value = true;
        onScrollUnlocked(fn1);
        onScrollUnlocked(fn2);
        nextTick().then(() => {
          onScrollUnlockedClear(fn1);
          scrollLockRequested.value = false;
        });
      },
    });

    const wrapper = mount(Component, mountOptions);
    expect.soft(fn1).not.toHaveBeenCalled();
    expect.soft(fn2).not.toHaveBeenCalled();

    await nextTick();
    expect.soft(fn1).not.toHaveBeenCalled();
    expect.soft(fn2).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
