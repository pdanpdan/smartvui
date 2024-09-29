export {};

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      prefersDark?: boolean | null;
      prefersLang?: string | null;
      viewport?: {
        width?: number | null;
        height?: number | null;
      };
      forceUserAgent?: string | null;
    }
  }
}
