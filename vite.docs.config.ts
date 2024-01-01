import { URL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

import Markdown from 'unplugin-vue-markdown/vite';
import LinkAttributes from 'markdown-it-link-attributes';
import Shiki from 'markdown-it-shikiji';
import { alert } from '@mdit/plugin-alert';
import { snippet } from '@mdit/plugin-snippet';

import Vue from '@vitejs/plugin-vue';
import Vike from 'vike/plugin';
import MkCert from 'vite-plugin-mkcert';
import { defineConfig } from 'vite';
import type { Connect, PreviewServer, ViteDevServer } from 'vite';

function setPrefersColorSchemeHeaders() {
  const middleware: Connect.NextHandleFunction = (_, response, next) => {
    response.setHeader('Accept-Ch', 'Sec-Ch-Prefers-Color-Scheme');
    response.setHeader('Critical-Ch', 'Sec-Ch-Prefers-Color-Scheme');
    response.setHeader('Vary', 'Sec-Ch-Prefers-Color-Scheme');
    next();
  };

  return {
    name: 'set-prefers-color-scheme-headers',
    configureServer: (server: ViteDevServer) => {
      server.middlewares.use(middleware);
    },
    configurePreviewServer: (server: PreviewServer) => {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  base: '/smartvui/',

  resolve: {
    alias: [
      { find: '$lib', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '$docs', replacement: fileURLToPath(new URL('./docs/src', import.meta.url)) },
    ],
  },

  plugins: [
    Vue({
      include: [ /\.vue$/, /\.md$/ ],
      script: {
        defineModel: true,
      },
    }),

    Vike({
      prerender: true,
      trailingSlash: false,
    }),

    Markdown({
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
          highlightLines: true,
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
            if (path.startsWith('$docs')) {
              return resolve(__dirname, 'docs', 'src', path.replace('#', ''));
            }
            if (path.startsWith('$lib')) {
              return resolve(__dirname, 'src', path.replace('#', ''));
            }

            return resolve(cwd || '.', path);
          },
        });
      },
    }),

    MkCert(),

    setPrefersColorSchemeHeaders(),
  ],

  root: resolve(__dirname, 'docs'),
  publicDir: resolve(__dirname, 'docs', 'public'),

  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'docs', 'dist'),
    // minify: false,
  },

  optimizeDeps: {
    include: [ 'cross-fetch' ],
  },

  ssr: {
    noExternal: [
      '@pdanpdan/smartvui',
    ],
  },
});
