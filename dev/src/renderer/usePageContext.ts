import { inject } from 'vue';
import type { App, InjectionKey } from 'vue';
import type { PageContext } from 'vike/types';

const key = Symbol('PageContext') as InjectionKey<PageContext>;

export function usePageContext() {
  const pageContext = inject(key);
  if (!pageContext) {
    throw new Error('setPageContext() not called in parent');
  }
  return pageContext;
}

export function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext);
}
