// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562
import { resolve } from 'node:path';
import process from 'node:process';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import chalk from 'chalk';
import { renderPage } from 'vike/server';
import { listen } from 'listhen';
import ROOT from '$dev/root';

const isProduction = process.env.NODE_ENV === 'production';
const isStatic = process.argv[ 2 ] === 'static' && isProduction;
const baseURL = '/dev';
const filesRoot = resolve(ROOT, '..', 'dist', 'client');
const notFound = resolve(filesRoot, '404.html');

startServer();

async function startServer() {
  const app = express();
  app.use(compression());

  const router = express.Router();
  app.use(baseURL, router);

  if (isProduction) {
    const assets = sirv(filesRoot);
    router.use((req, res, next) => {
      assets(req, res, next);
      if (!res.locals.vps) {
        console.info(`${ chalk.green('static') } ${ res.statusCode } ${ req.originalUrl }`);
      }
    });
  } else {
    const vite = await import('vite');
    const viteServer = await vite.createServer({
      configFile: 'vite.dev.config.ts',
      server: { middlewareMode: true },
    });
    app.use(viteServer.middlewares);
  }

  if (isStatic === true) {
    router.get('*', async (_, res) => {
      res
        .status(404)
        .type('text/html')
        .sendFile(notFound);
    });
  } else {
    app.get('*', async (req, res, next) => {
      res.locals.vps = true;

      const initialPageContext = {
        urlOriginal: req.originalUrl,
        prefersDark: null as boolean | null,
        prefersLang: req.headers[ 'accept-language' ] || null as string | null,
        isMobile: req.headers[ 'sec-ch-ua-mobile' ] && req.headers[ 'sec-ch-ua-mobile' ].includes('1'),
        platform: req.headers[ 'sec-ch-ua-platform' ] || null as string | null,
        userAgent: req.headers[ 'user-agent' ] || null as string | null,
      };

      if (req.headers[ 'sec-ch-prefers-color-scheme' ] === 'dark') {
        initialPageContext.prefersDark = true;
      } else if (req.headers[ 'sec-ch-prefers-color-scheme' ] === 'light') {
        initialPageContext.prefersDark = false;
      }

      const pageContext = await renderPage(initialPageContext);
      const { httpResponse } = pageContext;

      if (!httpResponse) {
        return next();
      }

      const { statusCode, headers, earlyHints } = httpResponse;

      if (res.writeEarlyHints) {
        res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
      }

      res.status(statusCode);
      headers.forEach(([ name, value ]) => res.setHeader(name, value));
      res.setHeader('Accept-Ch', 'Sec-Ch-Prefers-Color-Scheme');
      res.setHeader('Critical-Ch', 'Sec-Ch-Prefers-Color-Scheme');
      res.setHeader('Vary', 'Sec-Ch-Prefers-Color-Scheme');
      httpResponse.pipe(res);

      if (isProduction) {
        console.info(`${ chalk.blue('render') } ${ statusCode } ${ req.originalUrl }`);
      }
    });
  }

  await listen(app, {
    qr: true,
    ws: true,
    https: true,
    public: true,
    baseURL,
  });

  console.info(`${ chalk.green('server') } mode=${ isProduction ? (isStatic === true ? 'render' : 'static') : 'dev' }`);
}
