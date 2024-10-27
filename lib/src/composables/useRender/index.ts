import type {
  Component,
  ComponentInternalInstance,
  MaybeRefOrGetter,
  RendererNode,
  VNode,
  WatchHandle,
} from 'vue';

import {
  getCurrentInstance,
  h,
  onScopeDispose,
  toValue,
  render as vueRender,
  watchEffect,
} from 'vue';

import type { ComponentExposed, ComponentProps, ComponentSlots, VNodeChildren } from '$lib/utils/types';

import { isClient } from '$lib/utils/is';

/**
 * Returned object from `useRender`.
 *
 * @public
 */
export interface UseRenderReturn {
  /**
   * Function to render a Vue component using current Vue scope.
   * Receives:
   *   - a Vue component (or a ref or getter for a Vue component)
   *   - an object with options for rendering:
   *     - parent element where it shoud be mounted
   *     - component props (or a ref or getter for props for Vue component)
   *     - children to be rendered inside the component (the same type used by Vue's `h` function)
   */
  render: <C extends Component>(
    /** Vue component (or ref or getter for a Vue component) to be rendered. */
    component: MaybeRefOrGetter<C>,
    options?: {
      /** Parent element to be used to insert the rendered component into. If not specified a new `div` will be inserted at the end of the document `body`. */
      parentElement?: Element | null;
      /** Component props (or a ref or getter for props for Vue component). */
      props?: MaybeRefOrGetter<ComponentProps<C>>;
      /** Children to be rendered inside the component (the same type used by Vue's `h` function). */
      children?: VNodeChildren | (() => VNodeChildren) | Partial<ComponentSlots<C>>;
    },
  ) => {
    /** Stops rendering the component. */
    stop: () => void;
    /** Returns the rendered element (or undefined if it is not rendered). */
    getComponentElement: () => RendererNode | null | undefined;
    /** Returns the exposed properties of the rendered component (or undefined if it is not rendered or nothing is exposed). */
    getComponentExposed: () => ComponentExposed<C> | null | undefined;
    /** Returns the parent element of the rendered component (or undefined if it is not rendered). */
    getParentElement: () => Element | undefined;
  };
  /** Function to stop rendering all components and remove them from DOM. It is called automatically on Vue scope dispose. */
  stopAll: () => void;
}

/**
 * Returns a function that can render Vue components programatically in a Vue scope.
 *
 * @public
 * @param currentInstance - Vue current instance. If not present it is extracted using `getCurrentInstance`.
 * @returns An object with two methods: `render` to render Vue components, and `stopAll` to clear all rendered components.
 */
export function useRender(currentInstance?: (ComponentInternalInstance & { provides?: Record<string | symbol, unknown>; }) | null): UseRenderReturn {
  if (currentInstance == null) {
    currentInstance = getCurrentInstance();
  }

  const renderStopFns: (() => void)[] = [];

  const render: UseRenderReturn[ 'render' ] = (
    component,
    { parentElement, props, children } = {},
  ) => {
    if (!isClient) {
      throw new Error('useRender\'s `render` can only be used on client side.');
    }

    let vNode: VNode | undefined;
    let localParentElement: Element | undefined;
    let stopWatching: WatchHandle | undefined;

    let renderStopFn: (() => void) | undefined = () => {
      if (renderStopFn != null) {
        const index = renderStopFns.indexOf(renderStopFn);
        if (index > -1) {
          renderStopFns.splice(index, 1);
        }
      }

      if (stopWatching != null) {
        stopWatching();
        stopWatching = undefined;
      }

      if (localParentElement != null) {
        vueRender(null, localParentElement);

        if (parentElement == null) {
          localParentElement.remove();
        }
        localParentElement = undefined;
      }

      vNode = undefined;
      renderStopFn = undefined;
    };

    localParentElement = parentElement ?? document.createElement('div');
    if (parentElement == null) {
      document.body.appendChild(localParentElement);
    }

    stopWatching = watchEffect(() => {
      vNode = h(toValue(component), toValue(props), children);

      if (currentInstance != null) {
        vNode.appContext = {
          ...currentInstance.appContext,
          provides: {
            ...currentInstance.appContext.provides,
            ...currentInstance.provides,
          },
        };
      }

      vueRender(vNode, localParentElement!);
    });
    renderStopFns.push(renderStopFn);

    return {
      stop: () => { renderStopFn?.(); },
      getComponentElement: () => vNode?.el,
      getComponentExposed: () => vNode?.component?.exposed || vNode?.component?.proxy,
      getParentElement: () => localParentElement,
    } as ReturnType<UseRenderReturn[ 'render' ]>;
  };

  const stopAll = () => {
    [ ...renderStopFns ].forEach((renderStopFn) => renderStopFn());
    renderStopFns.length = 0;
  };

  onScopeDispose(stopAll, true);

  return {
    render,
    stopAll,
  };
}
