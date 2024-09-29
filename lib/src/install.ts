import type { App } from 'vue';

import type * as ComponentsNs from './components';
import type * as ComposablesNs from './composables';

/**
 * All components.
 *
 * @public
 */
export type { ComponentsNs };

/**
 * All composables.
 *
 * @public
 */
export type { ComposablesNs };

/**
 * Component.
 *
 * @public
 */
export type Components = typeof ComponentsNs[ keyof typeof ComponentsNs ];

/**
 * Composable.
 *
 * @public
 */
export type Composables = typeof ComposablesNs[ keyof typeof ComposablesNs ];

/**
 * Composable configuration for install.
 *
 * @public
 */
export type ComposableConfiguration = Composables
  | (Composables extends infer CI
    ? CI extends { install: (app: App, options: infer O) => void; }
      ? [ comp: Composables, opt?: O ]
      : [ comp: Composables ]
    : never
  );

/**
 * Composable plugin install options.
 *
 * @public
 */
export interface InstallOptions {
  /**
   * List of components to install globally
   * or object where keys specify the name to use to register the component.
   */
  components?: { [ K: string ]: Components; } | Components[];
  /**
   * List of composable options to install
   * or object where keys are the composable name.
   *
   * A composable option can be:
   * - the composable (will be installed without options)
   * - a tupe [ Composable, ComposableOptions ] where ComposableOptions is optional
   */
  composables?: { [ K: string ]: ComposableConfiguration; } | ComposableConfiguration[];
}

const reCompName = /^\D/;

/**
 * Vue plugin install function.
 *
 * @public
 * @param app - Vue `App` instance
 * @param options - Plugin install options
 */
export function install(app: App, options: InstallOptions = {}) {
  if (options.components) {
    Object.entries(options.components).forEach(([ name, comp ]) => {
      app.component(reCompName.test(name) ? name : comp.name!, comp);
    });
  }

  if (options.composables) {
    Object.values(options.composables).forEach((composable) => {
      const opt = Array.isArray(composable) ? composable[ 1 ] : undefined;
      const comp = Array.isArray(composable) ? composable[ 0 ] : composable;
      if ('install' in comp) {
        comp.install(app, opt);
      }
    });
  }
}
