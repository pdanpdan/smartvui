import { libComponentNames, libName } from '$lib/libraryInfo';

function defaultTransformFn(componentName: string, sass: boolean = false) {
  return [
    sass === true
      ? `${ libName }/src/components/${ componentName }/index.sass`
      : `${ libName }/styles/components/${ componentName }.css`,
  ];
}

/**
 * UnpluginVueComponentsSmartVui resolver configuration.
 *
 * @public
 * @typeParam configuration - Resolver configuration.
 */
export interface UnpluginVueComponentsSmartVuiResolverConfig {
  skipSideEffects?: boolean;
  /** Load SASS sideEffects instead of CSS */
  sass?: boolean;
  /** Transform function for sideEffects. */
  transform?: (defaultTransform: (componentName: string, sass?: boolean) => string[], componentName: string, sass?: boolean) => string[];
  /** Resolver function. Should return `truthy` values if path exists and `falsy` values or throw error if path does not exists. */
  resolver?: (path: string) => unknown;
}

/**
 * UnpluginVueComponents resolver to auto-load SmartVui components.
 *
 * @public
 * @returns UnpluginVueComponents resolver.
 */
export function unpluginVueComponentsSmartVuiResolver({
  skipSideEffects = false,
  sass = false,
  transform = (defaultTransform, componentName, sass) => defaultTransform(componentName, sass),
  resolver = import.meta.resolve,
}: UnpluginVueComponentsSmartVuiResolverConfig = {}) {
  return {
    type: 'component' as 'component' | 'directive',

    resolve(componentName: string) {
      if (libComponentNames.includes(componentName)) {
        const sideEffects = !skipSideEffects
          ? transform(defaultTransformFn, componentName, sass).filter((filePath) => {
            if (!resolver) {
              return true;
            }

            try {
              if (resolver(filePath)) {
                return true;
              }
            } catch (ignore) {}

            console.warn(`[ UnpluginVueComponentsSmartVuiResolver ] Not found [${ filePath }`);

            return false;
          })
          : undefined;

        return {
          name: componentName,
          from: libName,
          sideEffects: Array.isArray(sideEffects) && sideEffects.length > 0 ? sideEffects : undefined,
        };
      }
    },
  };
}
