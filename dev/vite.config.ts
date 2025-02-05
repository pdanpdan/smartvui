import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import { hattip } from '@hattip/vite';
import { alert } from '@mdit/plugin-alert';
import { snippet } from '@mdit/plugin-snippet';
import Shiki from '@shikijs/markdown-it';
import vue from '@vitejs/plugin-vue';
import LinkAttributes from 'markdown-it-link-attributes';
import { NodePackageImporter } from 'sass-embedded';
import UnoCSS from 'unocss/vite';
import md from 'unplugin-vue-markdown/vite';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import MkCert from 'vite-plugin-mkcert';

import { name as libName } from '../lib/package.json';

export default defineConfig({
  base: '/dev',

  resolve: {
    alias: [
      { find: '$dev', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '$lib', replacement: fileURLToPath(new URL('../lib/src', import.meta.url)) },
    ],
  },

  plugins: [
    vike({
      prerender: true,
      trailingSlash: false,
    }),

    hattip(),

    vue({
      include: [ /\.vue$/, /\.md$/ ],
      script: {
        defineModel: true,
      },
    }),

    md({
      wrapperClasses: 'prose prose-sm m-auto text-left',
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      async markdownItSetup(md) {
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        });
        md.use(await Shiki({
          defaultColor: false,
          themes: {
            light: 'material-theme-lighter',
            dark: 'material-theme-darker',
          },
        }));

        md.use(alert, {
          deep: true,
        });
        md.use(snippet, {
          currentPath: (env) => env.id,
          resolvePath: (path, cwd) => {
            if (path.startsWith('$dev')) {
              return resolve(__dirname, 'src', path.replace('#', ''));
            }
            if (path.startsWith('$lib')) {
              return resolve(__dirname, '..', 'lib', 'src', path.replace('#', ''));
            }

            return resolve(cwd || '.', path);
          },
        });
      },
    }),

    UnoCSS(),

    MkCert(),
  ],

  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),

  server: {
    hmr: {
      port: 3333,
    },
  },

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
    outDir: resolve(__dirname, 'dist'),
  },

  ssr: {
    noExternal: [
      libName,
    ],
  },
});
