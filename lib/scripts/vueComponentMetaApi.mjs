import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createChecker } from 'vue-component-meta';

const componentNames = readdirSync(join(import.meta.dirname, '..', 'src', 'components'), { withFileTypes: true })
  .filter((f) => f.isDirectory())
  .map((f) => f.name);

const checkerOptions = {
  forceUseTs: true,
  // schema: { ignore: [ 'MyIgnoredNestedProps' ] },
  printer: { newLine: 1 },
  noDeclarations: true,
};

const tsconfigChecker = createChecker(
  join(import.meta.dirname, '..', 'tsconfig.build.json'),
  checkerOptions,
);

function filterMeta(meta) {
  return {
    props: meta.props.filter((o) => !o.global).map((o) => ({
      name: o.name,
      description: o.description,
      tags: o.tags,
      required: o.required,
      type: o.type,
      schema: o.schema,
      default: o.default,
    })),
    events: meta.events.map((o) => ({
      name: o.name,
      description: o.description,
      tags: o.tags,
      type: o.type,
      signature: o.signature,
      schema: o.schema,
    })),
    slots: meta.slots.map((o) => ({
      name: o.name,
      type: o.type,
      description: o.description,
      tags: o.tags,
      schema: o.schema,
    })),
  };
}

componentNames.forEach((componentName) => {
  const componentFilePath = join(import.meta.dirname, '..', 'src', 'components', componentName, `${ componentName }.vue`);

  const meta = filterMeta(tsconfigChecker.getComponentMeta(componentFilePath));

  const outputPath = join(import.meta.dirname, '..', 'dist', 'api', 'components');
  mkdirSync(outputPath, { recursive: true });
  writeFileSync(join(outputPath, `${ componentName }.json`), `${ JSON.stringify(meta, null, 2) }\n`);
});
