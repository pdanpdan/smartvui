import type { PageContext } from 'vike/types';
import isCallable from '$dev/utils/isCallable';

export function getPageTitle(pageContext: PageContext): string | null {
  if (pageContext.data?.title !== undefined) {
    return pageContext.data.title;
  }

  if (pageContext.title !== undefined) {
    return pageContext.title;
  }

  const tmp = pageContext.configEntries.title;
  const titleConfig = tmp === null || tmp === undefined ? undefined : tmp[ 0 ];
  if (!titleConfig) {
    return null;
  }

  const title = titleConfig.configValue;
  if (typeof title === 'string') {
    return title;
  }

  if (!title) {
    return null;
  }

  const { configDefinedAt } = titleConfig;
  if (isCallable(title)) {
    const val = title(pageContext);
    if (typeof val !== 'string') {
      throw new TypeError(`${ configDefinedAt } should return a string`);
    }

    return val;
  }

  throw new Error(`${ configDefinedAt } should be a string or a function returning a string`);
}
