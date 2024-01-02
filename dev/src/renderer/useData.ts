// Hook `useData()` to make `pageContext.data` available from any Vue component.
// See
// * https://vike.dev/data
// * https://vike.dev/pageContext-anywhere

import { type ComputedRef, computed } from 'vue';
import { usePageContext } from './usePageContext';

export function useData<Data>(): ComputedRef<Data> {
  return computed(() => usePageContext().data as Data);
}
