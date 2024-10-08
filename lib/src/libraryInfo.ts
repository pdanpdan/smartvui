import * as paths from '$lib/paths.json';

import packageJson from '../package.json' with { type: 'json'};

/** Library name. */
export const libName: string = packageJson.name;

/** Library version. */
export const libVersion: string = packageJson.version;

/** Component names */
export const libComponentNames: string[] = paths.components;
