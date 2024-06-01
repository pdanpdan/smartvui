// Hook `useData()` to make `pageContext.data` available from any Vue component.
// See
// * https://vike.dev/data
// * https://vike.dev/pageContext-anywhere

import { usePageContext } from './usePageContext';

export function useData<Data>(): Data {
  const { data } = usePageContext();

  return data as Data;
}
