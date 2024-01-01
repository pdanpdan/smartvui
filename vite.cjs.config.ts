import { URL, fileURLToPath } from 'node:url';
import { parse, resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { defineConfig } from 'vite';

function scanEntries(entryDirs: string | string[]) {
  const entries: Record<string, string> = {};
  const counter: Record<string, number> = {};

  for (const entryDir of [ entryDirs ].flat()) {
    if (!entryDir) {
      break;
    }

    const flattenEntries = statSync(entryDir).isDirectory()
      ? readdirSync(entryDir).map((v) => resolve(entryDir, v))
      : [ entryDir ];

    for (const entry of flattenEntries) {
      const parsed = parse(entry);
      const name = `${ parsed.dir.split('/').at(-1) }---${ parsed.name }${ parsed.ext === '' ? '---index' : '' }`;
      const entryIndex = counter[ name ] || 0;
      entries[ `${ name }${ entryIndex || '' }` ] = entry;
      counter[ name ] = entryIndex + 1;
    }
  }

  return entries;
}

const entries = {
  tokens: resolve(__dirname, './src/style/tokens/index.sass'),
  'tokens-colors': resolve(__dirname, './src/style/tokens/colors.sass'),
  'tokens-typography': resolve(__dirname, './src/style/tokens/typography.sass'),

  base: resolve(__dirname, './src/style/base/index.sass'),

  themes: resolve(__dirname, './src/style/themes/index.sass'),
  'theme-light': resolve(__dirname, './src/style/themes/light.sass'),
  'theme-dark': resolve(__dirname, './src/style/themes/dark.sass'),

  index: resolve(__dirname, './src/index.ts'),

  ...scanEntries([
    resolve(__dirname, './src/components'),
  ]),

  ...scanEntries([
    resolve(__dirname, './src/composables'),
  ]),
};

export default defineConfig({
  resolve: {
    alias: [
      { find: '$lib', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },

  plugins: [
    vue(),
    libInjectCss(),
  ],

  publicDir: false,

  build: {
    emptyOutDir: false,
    target: 'esnext',
    outDir: resolve(__dirname, './dist'),
    sourcemap: true,
    // minify: false,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',

    lib: {
      entry: entries.index,
      formats: [ 'cjs' ],
    },

    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
        '@material/material-color-utilities',
      ],

      input: entries,

      output: {
        exports: 'named',
        sourcemapExcludeSources: true,
        inlineDynamicImports: false,

        chunkFileNames: 'chunks/[name].[hash].cjs',
        entryFileNames: (chunkInfo) => `${ chunkInfo.name!.split('---').join('/') }.cjs`,
        assetFileNames: (chunkInfo) => `styles/${ chunkInfo.name!.split('---').join('/') }`,
      },
    },
  },
});
