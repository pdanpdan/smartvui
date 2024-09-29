import * as paths from '$lib/paths.json';

import * as pkg from '../package.json';

/** Library name. */
export const libName: string = pkg.name;

/** Library version. */
export const libVersion: string = pkg.version;

/** Component names */
export const libComponentNames: string[] = paths.components;
