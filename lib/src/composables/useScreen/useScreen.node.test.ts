// @vitest-environment node

import { renderToString } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';

import { usePlatform, useScreen } from '$lib/composables';
import { SmartVui } from '$lib/index';
import { stringifyHtml } from '$lib/test_utils/stringify';

function createScreenDefault({ width = 1280, height = 960 } = {}) {
  return {
    pageInlineSize: width,
    pageBlockSize: height,
    screenInlineSize: width,
    screenBlockSize: height,
    viewInlineSize: width,
    viewBlockSize: height,
    viewScale: 1,
    scrollInlineGutter: 0,
    scrollBlockGutter: 0,
    pageInlineStart: 0,
    pageBlockStart: 0,
    virtualKeyboardOpen: false,
    scrollLocked: false,
    scrollLockRequested: false,
  };
}

describe('useScreen [node]', () => {
  describe('in isolation', () => {
    it('should return default values', () => {
      const screen = useScreen();
      expect.soft(screen.pageInlineSize.value).toBe(1280);
      expect.soft(screen.pageBlockSize.value).toBe(960);
      expect.soft(screen.screenInlineSize.value).toBe(1280);
      expect.soft(screen.screenBlockSize.value).toBe(960);
      expect.soft(screen.viewInlineSize.value).toBe(1280);
      expect.soft(screen.viewBlockSize.value).toBe(960);
      expect.soft(screen.viewScale.value).toBe(1);
      expect.soft(screen.scrollInlineGutter.value).toBe(0);
      expect.soft(screen.scrollBlockGutter.value).toBe(0);
      expect.soft(screen.pageInlineStart.value).toBe(0);
      expect.soft(screen.pageBlockStart.value).toBe(0);
      expect.soft(screen.virtualKeyboardOpen.value).toBe(false);
      expect.soft(screen.scrollLocked.value).toBe(false);
      expect.soft(screen.scrollLockRequested.value).toBe(false);
    });

    it('should return forced fixed values', () => {
      const screenW = useScreen({ width: 800 });
      expect.soft(screenW.pageInlineSize.value).toBe(800);
      expect.soft(screenW.pageBlockSize.value).toBe(960);
      expect.soft(screenW.screenInlineSize.value).toBe(800);
      expect.soft(screenW.screenBlockSize.value).toBe(960);
      expect.soft(screenW.viewInlineSize.value).toBe(800);
      expect.soft(screenW.viewBlockSize.value).toBe(960);

      const screenH = useScreen({ height: 400 });
      expect.soft(screenH.pageInlineSize.value).toBe(1280);
      expect.soft(screenH.pageBlockSize.value).toBe(400);
      expect.soft(screenH.screenInlineSize.value).toBe(1280);
      expect.soft(screenH.screenBlockSize.value).toBe(400);
      expect.soft(screenH.viewInlineSize.value).toBe(1280);
      expect.soft(screenH.viewBlockSize.value).toBe(400);

      const screen = useScreen({ width: 800, height: 400 });
      expect.soft(screen.pageInlineSize.value).toBe(800);
      expect.soft(screen.pageBlockSize.value).toBe(400);
      expect.soft(screen.screenInlineSize.value).toBe(800);
      expect.soft(screen.screenBlockSize.value).toBe(400);
      expect.soft(screen.viewInlineSize.value).toBe(800);
      expect.soft(screen.viewBlockSize.value).toBe(400);
    });

    it('should return forced reactive values', () => {
      const width = ref<number | null>(null);
      const height = ref<number | null>(null);
      const screen = useScreen({ width, height });

      expect.soft(screen.pageInlineSize.value).toBe(1280);
      expect.soft(screen.pageBlockSize.value).toBe(960);
      expect.soft(screen.screenInlineSize.value).toBe(1280);
      expect.soft(screen.screenBlockSize.value).toBe(960);
      expect.soft(screen.viewInlineSize.value).toBe(1280);
      expect.soft(screen.viewBlockSize.value).toBe(960);

      width.value = 800;
      expect.soft(screen.pageInlineSize.value).toBe(800);
      expect.soft(screen.pageBlockSize.value).toBe(960);
      expect.soft(screen.screenInlineSize.value).toBe(800);
      expect.soft(screen.screenBlockSize.value).toBe(960);
      expect.soft(screen.viewInlineSize.value).toBe(800);
      expect.soft(screen.viewBlockSize.value).toBe(960);

      width.value = null;
      height.value = 400;
      expect.soft(screen.pageInlineSize.value).toBe(1280);
      expect.soft(screen.pageBlockSize.value).toBe(400);
      expect.soft(screen.screenInlineSize.value).toBe(1280);
      expect.soft(screen.screenBlockSize.value).toBe(400);
      expect.soft(screen.viewInlineSize.value).toBe(1280);
      expect.soft(screen.viewBlockSize.value).toBe(400);
    });

    it('should only set scrollLockRequested', () => {
      const { scrollLocked, scrollLockRequested } = useScreen();
      expect.soft(scrollLocked.value).toBe(false);
      expect.soft(scrollLockRequested.value).toBe(false);

      scrollLockRequested.value = false;
      expect.soft(scrollLocked.value).toBe(false);
      expect.soft(scrollLockRequested.value).toBe(false);

      scrollLockRequested.value = true;
      expect.soft(scrollLockRequested.value).toBe(true);
      expect.soft(scrollLocked.value).toBe(false);

      scrollLockRequested.value = true;
      expect.soft(scrollLockRequested.value).toBe(true);
      expect.soft(scrollLocked.value).toBe(false);

      scrollLockRequested.value = false;
      expect.soft(scrollLockRequested.value).toBe(false);
      expect.soft(scrollLocked.value).toBe(false);

      const { scrollLocked: scrollLocked2, scrollLockRequested: scrollLockRequested2 } = useScreen();

      scrollLockRequested.value = true;
      expect.soft(scrollLockRequested.value).toBe(true);
      expect.soft(scrollLocked.value).toBe(false);
      expect.soft(scrollLockRequested2.value).toBe(false);
      expect.soft(scrollLocked2.value).toBe(false);

      scrollLockRequested2.value = true;
      expect.soft(scrollLockRequested.value).toBe(true);
      expect.soft(scrollLocked.value).toBe(false);
      expect.soft(scrollLockRequested2.value).toBe(true);
      expect.soft(scrollLocked2.value).toBe(false);

      scrollLockRequested.value = false;
      expect.soft(scrollLockRequested.value).toBe(false);
      expect.soft(scrollLocked.value).toBe(false);
      expect.soft(scrollLockRequested2.value).toBe(true);
      expect.soft(scrollLocked2.value).toBe(false);

      scrollLockRequested2.value = false;
      expect.soft(scrollLocked.value).toBe(false);
      expect.soft(scrollLocked2.value).toBe(false);
      expect.soft(scrollLockRequested.value).toBe(false);
      expect.soft(scrollLockRequested2.value).toBe(false);
    });
  });

  describe('on SSR', () => {
    const Component = defineComponent({
      template: '{{ screen }}',
      props: [ 'defaults' ],
      setup(props) {
        return { screen: useScreen(props.defaults) };
      },
    });

    const ParentComponent = defineComponent({
      template: `parent={{ screen }}|child1=<Component :defaults="defaultsChild1" />|child2=<Component :defaults="defaultsChild2" />`,
      props: [ 'defaults', 'defaultsChild1', 'defaultsChild2' ],
      setup(props) {
        return { screen: useScreen(props.defaults) };
      },
    });

    const renderToStringOptions = {
      global: {
        plugins: [ [ SmartVui, { composables: [ usePlatform, useScreen ] } ] ],
        components: { Component },
      },
    } as Parameters<typeof renderToString>[ 1 ];

    it('should return forced values', async () => {
      expect.soft(await renderToString(Component, renderToStringOptions)).toBe(stringifyHtml(createScreenDefault()));

      expect.soft(await renderToString(Component, {
        props: { defaults: { width: 800 } },
        ...renderToStringOptions,
      })).toBe(stringifyHtml(createScreenDefault({ width: 800 })));

      expect.soft(await renderToString(Component, {
        props: { defaults: { height: 400 } },
        ...renderToStringOptions,
      })).toBe(stringifyHtml(createScreenDefault({ height: 400 })));

      expect.soft(await renderToString(Component, {
        props: { defaults: { width: 800, height: 400 } },
        ...renderToStringOptions,
      })).toBe(stringifyHtml(createScreenDefault({ width: 800, height: 400 })));
    });

    it('should reuse options if called from multiple components', async () => {
      const text = stringifyHtml(createScreenDefault({ width: 800, height: 400 }));
      expect.soft(await renderToString(ParentComponent, {
        props: { defaults: { width: 800, height: 400 } },
        ...renderToStringOptions,
      })).toContain(`parent=${ text }|child1=${ text }|child2=${ text }`);

      expect.soft(await renderToString(ParentComponent, {
        props: {
          defaults: { width: 800, height: 400 },
          defaultsChild1: { width: 100, height: 200 },
          defaultsChild2: { width: 200, height: 300 },
        },
        ...renderToStringOptions,
      })).toContain(`parent=${ text }|child1=${ text }|child2=${ text }`);

      const textDefault = stringifyHtml(createScreenDefault());
      expect.soft(await renderToString(ParentComponent, {
        props: {
          defaultsChild1: { width: 800, height: 400 },
          defaultsChild2: { width: 200, height: 300 },
        },
        ...renderToStringOptions,
      })).toContain(`parent=${ textDefault }|child1=${ text }|child2=${ text }`);
    });

    it('should not reuse options if called from multiple apps', async () => {
      const text1 = stringifyHtml(createScreenDefault({ width: 800, height: 400 }));
      expect.soft(await renderToString(ParentComponent, {
        props: { defaults: { width: 800, height: 400 } },
        ...renderToStringOptions,
      })).toContain(`parent=${ text1 }|child1=${ text1 }|child2=${ text1 }`);

      const text2 = stringifyHtml(createScreenDefault());
      expect.soft(await renderToString(ParentComponent, {
        ...renderToStringOptions,
      })).toContain(`parent=${ text2 }|child1=${ text2 }|child2=${ text2 }`);
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
      expect.soft(consoleWarnSpy).toHaveBeenCalledWith('[ SmartVui ] useScreen was not installed. It will not work as a singleton.');
      vi.restoreAllMocks();
    });
  });
});

describe('onScrollUnlocked [node]', () => {
  describe('in isolation', () => {
    it('should not execute function', () => {
      const fn = vi.fn();
      const { onScrollUnlocked } = useScreen();
      onScrollUnlocked(fn);
      expect.soft(fn).not.toHaveBeenCalled();
    });
  });

  describe('on SSR', () => {
    const renderToStringOptions = {
      global: {
        plugins: [ [ SmartVui, { composables: [ usePlatform, useScreen ] } ] ],
      },
    } as Parameters<typeof renderToString>[ 1 ];

    it('should not execute function', async () => {
      const fn = vi.fn();
      const ComponentUnlocked = defineComponent({
        template: 'Test',
        setup() {
          const { onScrollUnlocked } = useScreen();
          onScrollUnlocked(fn);
        },
      });

      await renderToString(ComponentUnlocked, renderToStringOptions);
      expect.soft(fn).not.toHaveBeenCalled();
    });
  });
});
