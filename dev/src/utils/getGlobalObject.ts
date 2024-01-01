declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __vite_plugin_ssr: undefined | Record<string, Record<string, unknown>>;
}

// We use the filename as key; each `getGlobalObject()` call should live in a unique filename.
export default function getGlobalObject<T extends Record<string, unknown> = never>(key: `${ string }.ts`, defaultValue: T): T {
  const allGlobalObjects = (globalThis.__vite_plugin_ssr = globalThis.__vite_plugin_ssr || {});
  const globalObject = (allGlobalObjects[ key ] = allGlobalObjects[ key ] || defaultValue);

  return globalObject as T;
}
