import { resolveRoute } from 'vike/routing';

import type { PageContext } from 'vike/types';

export function route(pageContext: PageContext) {
  if (pageContext.urlPathname === '/tests_1/starship' || pageContext.urlPathname === '/tests_1/starship/') {
    return { routeParams: { view: 'overview' } };
  }
  const result = resolveRoute('/tests_1/starship/@view', pageContext.urlPathname);
  if (![ 'reviews', 'spec' ].includes(result.routeParams.view)) {
    return false;
  }
  return result;
}
