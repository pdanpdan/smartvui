import type { OnBeforePrerenderStartAsync } from 'vike/types';
import { names } from './names';

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async (): ReturnType<OnBeforePrerenderStartAsync> => [ '/tests_1/hello', ...names.map((name) => `/tests_1/hello/${ name }`) ];
