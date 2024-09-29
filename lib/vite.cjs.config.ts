import { readdirSync, statSync } from 'node:fs';
import { parse, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { NodePackageImporter } from 'sass-embedded';
import { defineConfig } from 'vite';

function scanEntries(entryDirs: string | string[]) {
  const entries: Record<string, string> = {};
  const counter: Record<string, number> = {};

  for (const entryDir of [ entryDirs ].flat()) {
    if (!entryDir) {
      break;
    }

    const flattenEntries = statSync(entryDir).isDirectory()
      ? readdirSync(entryDir, { withFileTypes: true })
        .filter((v) => v.isDirectory())
        .map((v) => resolve(entryDir, v.name))
      : [];

    for (const entry of flattenEntries) {
      const parsed = parse(entry);
      const name = `${ parsed.dir.split('/').at(-1) }---${ parsed.name }---index`;
      const entryIndex = counter[ name ] || 0;
      entries[ `${ name }${ entryIndex || '' }` ] = entry;
      counter[ name ] = entryIndex + 1;
    }
  }

  return entries;
}

const entries = {
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
  ],

  publicDir: false,

  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
        importers: [ new NodePackageImporter() ],
      },
    },
  },

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

        chunkFileNames: 'cjs/chunks/[name].[hash].cjs',
        entryFileNames: (chunkInfo) => `cjs/${ chunkInfo.name!.split('---').join('/') }.cjs`,
        assetFileNames: (chunkInfo) => {
          const componentNameMatch = /_([^.]+)\..*!~/.exec(chunkInfo.originalFileName ?? '');
          return componentNameMatch
            ? `styles/components/${ componentNameMatch[ 1 ] }.css`
            : `styles/${ chunkInfo.name!.split('---').join('/') }`;
        },
      },
    },
  },
});
