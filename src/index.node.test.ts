// @vitest-environment node

import { describe, expect, it } from 'vitest';
import type { App } from 'vue';
import umd from './index.umd';
import * as esm from './index';

describe('should find composables', () => {
  it('should have composables in esm', () => {
    expect.soft(esm).toHaveProperty('composables');
  });

  it('should have composables in umd', () => {
    expect.soft(umd).toHaveProperty('composables');
  });
});

it('should install components', () => {
  const components = [];
  const app = {
    component: (name: string) => {
      components.push(name);
    },
  };
  esm.install(app as App);

  expect.soft(components.length).toBeGreaterThanOrEqual(1);
});
