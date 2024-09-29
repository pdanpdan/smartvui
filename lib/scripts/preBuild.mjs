import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const paths = {
  components: readdirSync(join(import.meta.dirname, '..', 'src', 'components'), { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((f) => f.name),
  composables: readdirSync(join(import.meta.dirname, '..', 'src', 'composables'), { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((f) => f.name),
};

writeFileSync(join(import.meta.dirname, '..', 'src', 'paths.json'), `${ JSON.stringify(paths, null, 2) }\n`);
