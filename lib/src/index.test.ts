import type { App } from 'vue';

import { beforeAll, describe, expect, it, vi } from 'vitest';

import * as components from '$lib/components';
import * as composables from '$lib/composables';

describe('entry point [browser]', () => {
  it('should throw error when Vue is not present', async () => {
    const load = () => import('$lib/index.umd');
    vi.stubGlobal('Vue', null);
    vi.resetModules();
    await expect.soft(load).rejects.toThrowError('[ SmartVui ] Vue is required to run. Please add a script tag for it before loading SmartVui.');
    vi.unstubAllGlobals();
  });

  describe('composables', () => {
    const installedComponents: string[] = [];
    const installedComposables: (string | symbol)[] = [];
    const installableComposables = Object.entries(composables).filter(([ _, val ]) => 'install' in val).map(([ name ]) => name);
    const composablesCount = installableComposables.length;

    const app = {
      component: (name: string) => {
        installedComponents.push(name);
      },

      provide(key: string | symbol, _value: unknown) {
        installedComposables.push(typeof key === 'string' ? key : key.description ?? key);
      },
    } as App;

    beforeAll(async () => {
      vi.resetModules();
      vi.stubGlobal('Vue', {});
      await import('$lib/index.umd');

      return () => {
        vi.resetModules();
        vi.unstubAllGlobals();
      };
    });

    it('should have composables', () => {
      expect.soft(Object.keys(window.SmartVui!)).toEqual(expect.arrayContaining(Object.keys(composables)));
    });

    it('should install all composables', () => {
      installedComposables.length = 0;
      (window.SmartVui as { install: (a: typeof app) => void; }).install(app);
      expect.soft(installedComposables.length).toBe(composablesCount);
      expect.soft(installedComposables).toEqual(installableComposables);
    });
  });

  describe('components', () => {
    const installedComponents: string[] = [];
    const installedComposables: (string | symbol)[] = [];
    const componentsCount = Object.keys(components).length;

    const app = {
      component: (name: string) => {
        installedComponents.push(name);
      },

      provide(key: string | symbol, _value: unknown) {
        installedComposables.push(typeof key === 'string' ? key : key.description ?? key);
      },
    } as App;

    beforeAll(async () => {
      vi.resetModules();
      vi.stubGlobal('Vue', {});
      await import('$lib/index.umd');

      return () => {
        vi.resetModules();
        vi.unstubAllGlobals();
      };
    });

    it('should have components', () => {
      expect.soft(Object.keys(window.SmartVui!)).toEqual(expect.arrayContaining(Object.keys(components)));
    });

    it('should install all components', () => {
      installedComponents.length = 0;
      (window.SmartVui as { install: (a: typeof app) => void; }).install(app);
      expect.soft(installedComponents.length).toBe(componentsCount);
      expect.soft(installedComponents).toEqual(Object.keys(components));
    });
  });
});
