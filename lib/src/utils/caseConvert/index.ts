function cacheStringFunction<T extends (str: string) => string>(fn: T): T {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    const hit = cache[ str ];
    return hit || (cache[ str ] = fn(str));
  }) as T;
}

const camelizeRE = /-(\w)/g;

/**
 * Convert string to camelCase.
 *
 * @public
 */
export const toCamelCase = cacheStringFunction((str: string) => str.replace(camelizeRE, (_, c) => c.toUpperCase()));

const hyphenateRE = /\B([A-Z])/g;
/**
 * Convert string to kebab-case.
 *
 * @public
 */
export const toKebabCase = cacheStringFunction((str: string) => str.replace(hyphenateRE, '-$1').toLowerCase());

/**
 * Convert string to PascalCase.
 *
 * @public
 */

export const toPascalCase = cacheStringFunction((str: string) => `${ str[ 0 ].toUpperCase() }${ toCamelCase(str.slice(1)) }`);
