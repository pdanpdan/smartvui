import type { OnPageTransitionStartAsync } from 'vike/types';

import state from '$dev/pages/pageTransitionState';

export const onPageTransitionStart: OnPageTransitionStartAsync = async (pageContext) => {
  console.log('Page transition start');
  // isBackwardNavigation
  // isClientSideNavigation
  // urlOriginal
  // urlParsed
  // urlPathname
  if (pageContext.isClientSideNavigation) {
    state.prevUrlTransition = 'sv-layout__main--transition-same';
    if (pageContext.urlPathname !== state.prevUrlPathname) {
      if (pageContext.urlPathname.startsWith(state.prevUrlPathname)) {
        state.prevUrlTransition = 'sv-layout__main--transition-deep';
      } else if (state.prevUrlPathname.startsWith(pageContext.urlPathname)) {
        state.prevUrlTransition = 'sv-layout__main--transition-high';
      }
    }
    document.querySelector('.sv-layout__main')?.classList.add(state.prevUrlTransition);
  }
  state.prevUrlPathname = pageContext.urlPathname;
};
