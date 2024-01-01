import { URL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
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

  build: {
    emptyOutDir: false,
    target: 'esnext',
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
      external: [ 'vue' ],

      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'default',
        sourcemapExcludeSources: true,
        inlineDynamicImports: false,
        entryFileNames: `${ LIB_NAME }.js`,
        assetFileNames: `styles/${ LIB_NAME }[extname]`,
      },
    },
  },
});
