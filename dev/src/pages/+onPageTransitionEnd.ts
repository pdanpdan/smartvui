import type { OnPageTransitionEndAsync } from 'vike/types';

import state from '$dev/pages/pageTransitionState';

export const onPageTransitionEnd: OnPageTransitionEndAsync = async () => {
  console.log('Page transition end');
  document.querySelector('.sv-layout__main')?.classList.remove(state.prevUrlTransition);
};
