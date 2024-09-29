// @vitest-environment node

import type { App } from 'vue';

import { describe, expect, it } from 'vitest';

import * as components from '$lib/components';
import * as composables from '$lib/composables';
import * as esm from '$lib/index';

type ComponentNames = keyof typeof components;
type ComposableNames = keyof typeof composables;

describe('entry point [node]', () => {
  describe('composables', () => {
    const installedComponents: string[] = [];
    const installedComposables: (string | symbol)[] = [];
    const installableComposables = Object.entries(composables).filter(([ _, val ]) => 'install' in val).map(([ name ]) => name);
    const composablesCount = installableComposables.length;
    const firstComposableName = installableComposables?.[ 0 ] as ComposableNames;

    const app = {
      component: (name: string) => {
        installedComponents.push(name);
      },

      provide(key: string | symbol, _value: unknown) {
        installedComposables.push(typeof key === 'string' ? key : key.description ?? key);
      },
    } as App;

    it('should have composables', () => {
      expect.soft(esm).toMatchObject(composables);
    });

    it('should install all composables', () => {
      installedComposables.length = 0;
      esm.SmartVui.install(app, { composables });
      expect.soft(installedComposables.length).toBe(composablesCount);
      expect.soft(installedComposables).toEqual(installableComposables);
    });

    it('should install no composables', () => {
      installedComposables.length = 0;
      esm.SmartVui.install(app, { composables: undefined });
      expect.soft(installedComposables.length).toBe(0);

      installedComposables.length = 0;
      esm.SmartVui.install(app, { composables: [] });
      expect.soft(installedComposables.length).toBe(0);
    });

    it('should install specified composables', () => {
      installedComposables.length = 0;
      esm.SmartVui.install(app, { composables: [ composables[ firstComposableName ] ] });
      expect.soft(installedComposables.length).toBe(1);
      expect.soft(installedComposables).toEqual([ firstComposableName ]);
    });

    it('should install specified composables with options', () => {
      installedComposables.length = 0;
      esm.SmartVui.install(app, {
        composables: [ [ composables.usePlatform, { forceUserAgent: 'Android' } ] ],
      });
      expect.soft(installedComposables.length).toBe(1);
      expect.soft(installedComposables).toEqual([ 'usePlatform' ]);
    });
  });

  describe('components', () => {
    const installedComponents: string[] = [];
    const installedComposables: (string | symbol)[] = [];
    const componentsCount = Object.keys(components).length;
    const firstComponentName = Object.keys(components)[ 0 ] as ComponentNames;

    const app = {
      component: (name: string) => {
        installedComponents.push(name);
      },

      provide(key: string | symbol, _value: unknown) {
        installedComposables.push(typeof key === 'string' ? key : key.description ?? key);
      },
    } as App;

    it('should have components', () => {
      expect.soft(esm).toMatchObject(components);
    });

    it('should install all components', () => {
      installedComponents.length = 0;
      esm.SmartVui.install(app, { components });
      expect.soft(installedComponents.length).toBe(componentsCount);
      expect.soft(installedComponents).toEqual(Object.keys(components));
    });

    it('should install no components', () => {
      installedComponents.length = 0;
      esm.SmartVui.install(app);
      expect.soft(installedComponents.length).toBe(0);

      installedComponents.length = 0;
      esm.SmartVui.install(app, {});
      expect.soft(installedComponents.length).toBe(0);

      installedComponents.length = 0;
      esm.SmartVui.install(app, { components: undefined });
      expect.soft(installedComponents.length).toBe(0);

      installedComponents.length = 0;
      esm.SmartVui.install(app, { components: [] });
      expect.soft(installedComponents.length).toBe(0);
    });

    it('should install specified components', () => {
      installedComponents.length = 0;
      esm.SmartVui.install(app, { components: [ components[ firstComponentName ] ] });
      expect.soft(installedComponents.length).toBe(1);
      expect.soft(installedComponents).toEqual([ firstComponentName ]);
    });

    it('should install specified components with other names', () => {
      installedComponents.length = 0;
      esm.SmartVui.install(app, { components: { test: components[ firstComponentName ] } });
      expect.soft(installedComponents.length).toBe(1);
      expect.soft(installedComponents).toEqual([ 'test' ]);
    });
  });
});
