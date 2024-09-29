import type { HattipHandler } from '@hattip/core';

import { createRouter } from '@hattip/router';
import { createHandler } from '@universal-middleware/hattip';

import { vikeHandler } from './server/vike-handler';

const router = createRouter();

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 */
router.use(createHandler(vikeHandler)());

const handler: HattipHandler = router.buildHandler();

export default handler;
