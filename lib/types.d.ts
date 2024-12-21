import type { DetachedWindowAPI } from 'happy-dom';

declare global {
  const happyDOM: DetachedWindowAPI;
}

declare interface Window {
  // extend the window
}

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue';

//   const component: DefineComponent<object, object, unknown>;
//   export default component;
// }

declare module '*.svg' {
  const imageUrl: string;
  export default imageUrl;
}

// with unplugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, unknown>;
  export default component;
}
