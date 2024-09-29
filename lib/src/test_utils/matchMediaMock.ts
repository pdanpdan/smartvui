export function mockMatchMedia() {
  const listeners: ({ rule: string; listener: (evt: MediaQueryListEvent) => void; })[] = [];
  const cache: Record<string, MediaQueryList> = {};

  const matchMedia = (rule: string) => {
    if (cache[ rule ] == null) {
      cache[ rule ] = {
        media: '',
        matches: false,
        onchange: () => {},
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_: string, listener: (evt: MediaQueryListEvent) => void) => {
          listeners.push({ rule, listener });
        },
        removeEventListener: (_: string, listener: (evt: MediaQueryListEvent) => void) => {
          const index = listeners.findIndex((o) => o.rule === rule && o.listener === listener);

          if (index > -1) {
            listeners.splice(index, 1);
          }
        },
      } as unknown as MediaQueryList;
    }

    return cache[ rule ];
  };

  const dispatchMediaQueryEvent = (rule: string, matchesOrEvt: boolean | MediaQueryListEvent) => {
    const evt = typeof matchesOrEvt === 'boolean' ? { matches: matchesOrEvt } as MediaQueryListEvent : matchesOrEvt;
    listeners.forEach((o) => {
      if (o.rule === rule) {
        o.listener(evt);
      }
    });
  };

  const setMediaQueryValue = (rule: string, matches: boolean) => {
    const ruleItem = matchMedia(rule);
    const oldMatches = ruleItem.matches;

    if (matches !== oldMatches) {
      Object.assign(ruleItem, { matches });
      dispatchMediaQueryEvent(rule, { matches } as MediaQueryListEvent);
    }
  };

  return {
    matchMedia,
    dispatchMediaQueryEvent,
    setMediaQueryValue,
    listeners,
  };
}
