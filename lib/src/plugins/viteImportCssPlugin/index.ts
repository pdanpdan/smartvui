import { libComponentNames, libName } from '$lib/libraryInfo';

function defaultTransformFn(componentName: string, sass: boolean = false) {
  return sass === true
    ? [ `${ libName }/src/components/${ componentName }/index.sass` ]
    : [ `${ libName }/styles/components/${ componentName }.css` ];
}

/**
 * ViteImportCss plugin configuration.
 *
 * @public
 * @typeParam configuration - Plugin configuration.
 */
export interface ViteImportCssPluginConfig {
  /** Load SASS instead of CSS */
  sass?: boolean;
  /** Transform function for style files. */
  transform?: (defaultTransform: (componentName: string, sass?: boolean) => string[], componentName: string, sass?: boolean) => string[];
  /** Resolver function. Should return `truthy` values if path exists and `falsy` values or throw error if path does not exists. */
  resolver?: (path: string) => unknown;
}

/**
 * Vite plugin to auto import CSS together with the component.
 *
 * @public
 * @returns Vite rule.
 */
export function viteImportCssPlugin({
  sass = false,
  transform = (defaultTransform, componentName, sass) => defaultTransform(componentName, sass),
  resolver = import.meta.resolve,
}: ViteImportCssPluginConfig = {}) {
  const cache = new Map();
  const matcher = new RegExp(`import\\s+{([^}]+)}\\s+from\\s+["']${ libName }`, 'gs');

  return {
    enforce: 'post',
    name: `vite:css-import(${ libName })`,

    transform(code: string, id: string) {
      if (!/\.(?:vue|[jt]sx?$)/.test(id)) {
        return code;
      }

      const components = [];
      let r = matcher.exec(code);
      while (r) {
        const list = r[ 1 ]
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.trim() !== '');
        components.push(...list);
        r = matcher.exec(code);
      }

      if (components.length === 0) {
        return code;
      }

      const css: string[] = [];

      components.forEach((c) => {
        const componentName = c.split(' as ')[ 0 ].trim();
        if (!libComponentNames.includes(componentName)) {
          return;
        }

        if (cache.has(componentName)) {
          css.push(...cache.get(componentName));

          return;
        }

        const filePaths = transform(defaultTransformFn, componentName, sass).filter((filePath) => {
          if (!resolver) {
            return true;
          }

          try {
            if (resolver(filePath)) {
              return true;
            }
          } catch (ignore) {}

          console.warn(`[ VitePluginImportCss ] Not found [${ filePath }`);

          return false;
        });

        cache.set(componentName, filePaths);
        css.push(...filePaths);
      });

      return css.length > 0
        ? `${ css.map((path) => `import '${ path }';`).join('\n') }\n${ code }`
        : code;
    },
  };
}
