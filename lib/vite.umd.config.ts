import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { NodePackageImporter } from 'sass-embedded';
import { defineConfig } from 'vite';

const LIB_NAME = 'SmartVui';

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
    target: 'es2022',
    outDir: resolve(__dirname, './dist'),
    sourcemap: true,
    // minify: false,
    cssMinify: 'lightningcss',

    lib: {
      entry: resolve(__dirname, './src/index.umd.ts'),
      name: LIB_NAME,
      formats: [ 'umd' ],
    },

    rollupOptions: {
      external: [
        'vue',
      ],

      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'default',
        sourcemapExcludeSources: true,
        inlineDynamicImports: false,
        entryFileNames: `${ LIB_NAME }.js`,
        assetFileNames: `${ LIB_NAME }[extname]`,
      },
    },
  },
});
