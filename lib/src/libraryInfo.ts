import * as paths from '$lib/paths.json';

import { name, version } from '../package.json' with { type: 'json'};

/** Library name. */
export const libName: string = name;

/** Library version. */
export const libVersion: string = version;

/** Component names */
export const libComponentNames: string[] = paths.components;
