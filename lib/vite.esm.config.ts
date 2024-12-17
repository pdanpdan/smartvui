import type { UserConfig } from 'vite';

import { readdirSync, statSync } from 'node:fs';
import { parse, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { NodePackageImporter } from 'sass-embedded';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import packageJson from './package.json' with { type: 'json'};

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
  tokens: resolve(__dirname, './src/style/tokens/index.sass'),
  'tokens-colors': resolve(__dirname, './src/style/tokens/colors.sass'),
  'tokens-elevations': resolve(__dirname, './src/style/tokens/elevations.sass'),
  'tokens-motion': resolve(__dirname, './src/style/tokens/motion.sass'),
  'tokens-shapes': resolve(__dirname, './src/style/tokens/shapes.sass'),
  'tokens-state': resolve(__dirname, './src/style/tokens/state.sass'),
  'tokens-typography': resolve(__dirname, './src/style/tokens/typography.sass'),

  base: resolve(__dirname, './src/style/base/index.sass'),

  'color-themes': resolve(__dirname, './src/style/color-themes/index.sass'),
  'color-theme-light': resolve(__dirname, './src/style/color-themes/light.sass'),
  'color-theme-dark': resolve(__dirname, './src/style/color-themes/dark.sass'),

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
    dts({
      insertTypesEntry: true,
      entryRoot: 'src',
      outDir: resolve(__dirname, './dist/types'),
      cleanVueFileName: true,
      strictOutput: true,
      tsconfigPath: 'tsconfig.build.json',
      copyDtsFiles: true,
    }),
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
    emptyOutDir: true,
    target: 'esnext',
    outDir: resolve(__dirname, './dist'),
    sourcemap: true,
    // minify: false,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',

    lib: {
      entry: entries.index,
      formats: [ 'es' ],
    },

    rollupOptions: {
      external: Object.keys(packageJson.peerDependencies),

      input: entries,

      output: {
        exports: 'named',
        sourcemapExcludeSources: true,
        inlineDynamicImports: false,

        chunkFileNames: 'mjs/chunks/[name].[hash].mjs',
        entryFileNames: (chunkInfo) => `mjs/${ chunkInfo.name!.split('---').join('/') }.mjs`,
        assetFileNames: (chunkInfo) => {
          const componentNameMatch = typeof chunkInfo.source === 'string'
            ? /\/\*!\s+@component:\s+(\S+)\s+\*\//.exec(chunkInfo.source ?? '')
            : /_([^.]+)\..*!~/.exec(chunkInfo.originalFileName ?? '');
          return componentNameMatch
            ? `styles/components/${ componentNameMatch[ 1 ] }.css`
            : `styles/${ chunkInfo.name!.split('---').join('/') }`;
        },
      },
    },
  },

  test: {
    include: [ 'src/**/*.test.ts' ],
    environmentMatchGlobs: [
      [ '**', 'happy-dom' ],
      [ '**\/*.node.test.ts', 'node' ],
    ],
    reporters: [ 'default', 'html' ],
    outputFile: {
      json: './coverage/json/index.json',
      html: './coverage/html/index.html',
    },
    coverage: {
      enabled: true,
      reporter: [ 'html', 'text' ],
      reportsDirectory: './coverage/',

      include: [ 'src/**/*.{ts,vue}' ],
      exclude: [ 'src/test_utils/**', 'src/**/*.test.ts', 'src/**/*.d.ts' ],
    },
  },
} as UserConfig);
