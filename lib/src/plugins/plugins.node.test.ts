// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

import { libName } from '$lib/libraryInfo';
import { unpluginVueComponentsSmartVuiResolver } from '$lib/plugins/unpluginVueComponentsSmartVuiResolver';
import { viteImportCssPlugin } from '$lib/plugins/viteImportCssPlugin';

describe('utils [node]', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('unpluginVueComponentsSmartVuiResolver', () => {
    const name = 'SvSurfaceModal';

    it('should load matching component with CSS style', () => {
      const { resolve } = unpluginVueComponentsSmartVuiResolver();
      expect.soft(resolve(name)).toMatchObject({
        name,
        from: libName,
        sideEffects: [ `${ libName }/styles/components/${ name }.css` ],
      });

      const { resolve: resolvePasses } = unpluginVueComponentsSmartVuiResolver({
        resolver: (_) => true,
      });
      expect.soft(resolvePasses(name)).toMatchObject({
        name,
        from: libName,
        sideEffects: [ `${ libName }/styles/components/${ name }.css` ],
      });
    });

    it('should load matching component with SASS style', () => {
      const { resolve } = unpluginVueComponentsSmartVuiResolver({ sass: true });
      expect.soft(resolve(name)).toMatchObject({
        name,
        from: libName,
        sideEffects: [ `${ libName }/src/components/${ name }/index.sass` ],
      });

      const { resolve: resolvePasses } = unpluginVueComponentsSmartVuiResolver({
        resolver: (_) => true,
        sass: true,
      });
      expect.soft(resolvePasses(name)).toMatchObject({
        name,
        from: libName,
        sideEffects: [ `${ libName }/src/components/${ name }/index.sass` ],
      });
    });

    it('should load matching component without style', () => {
      const { resolve } = unpluginVueComponentsSmartVuiResolver({ skipSideEffects: true });
      expect.soft(resolve(name)).toMatchObject({
        name,
        from: libName,
        sideEffects: undefined,
      });
    });

    it('should not load non-matching components', () => {
      const { resolve } = unpluginVueComponentsSmartVuiResolver();
      expect.soft(resolve(`${ name }_`)).toEqual(undefined);
    });

    it('should not load non-existing styles', () => {
      const { resolve } = unpluginVueComponentsSmartVuiResolver({
        resolver: (_) => false,
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect.soft(resolve(`${ name }`)).toEqual({
        name,
        from: libName,
        sideEffects: undefined,
      });
      expect.soft(consoleWarnSpy).toHaveBeenLastCalledWith(expect.stringContaining('[ UnpluginVueComponentsSmartVuiResolver ] Not found'));

      const { resolve: resolveThrows } = unpluginVueComponentsSmartVuiResolver({
        resolver: (_) => {
          throw new Error('Not found');
        },
      });
      expect.soft(resolveThrows(`${ name }`)).toEqual({
        name,
        from: libName,
        sideEffects: undefined,
      });
      expect.soft(consoleWarnSpy).toHaveBeenLastCalledWith(expect.stringContaining('[ UnpluginVueComponentsSmartVuiResolver ] Not found'));
    });
  });

  describe('viteImportCssPlugin', () => {
    const codeGood: ([ string, string[] ])[] = [
      [ `__CODE_BEFORE__ import { SvSurfaceModal} from '${ libName }' __CODE_AFTER__`, [ 'SvSurfaceModal' ] ],
      [ `__CODE_BEFORE__ import {
  SvSurfaceModal as _SvSurfaceModal,
} from '${ libName }' __CODE_AFTER__`, [ 'SvSurfaceModal' ] ],
      [ `__CODE_BEFORE__ import {SvSurfaceModal,SvSurfacePopover } from "${ libName }" __CODE_AFTER__`, [ 'SvSurfaceModal', 'SvSurfacePopover' ] ],
      [ `__CODE_BEFORE__ import {
  SvSurfaceModal,
  SvSurfacePopover,
} from "${ libName }" __CODE_AFTER__`, [ 'SvSurfaceModal', 'SvSurfacePopover' ] ],
    ];

    const codeBad: ([ string, string[] ])[] = [
      [ `__CODE_BEFORE__ import { SvSurfaceModal } from '_${ libName }' __CODE_AFTER__`, [] ],
      [ `__CODE_BEFORE__ import {
  SvSurfaceModal as _SvSurfaceModal,
} from '_${ libName }' __CODE_AFTER__`, [] ],
      [ `__CODE_BEFORE__ import { SvSurfaceModal, SvSurfacePopover } from "_${ libName }" __CODE_AFTER__`, [] ],
      [ `__CODE_BEFORE__ import {
  SvSurfaceModal,
  SvSurfacePopover,
} from "_${ libName }" __CODE_AFTER__`, [] ],
      [ `__CODE_BEFORE__ import { SvSurfaceModal, Test } from '${ libName }' __CODE_AFTER__`, [ 'SvSurfaceModal' ] ],
      [ `__CODE_BEFORE__ import {
  SvSurfaceModal as _SvSurfaceModal,
  Test,
} from '${ libName }' __CODE_AFTER__`, [ 'SvSurfaceModal' ] ],
      [ `__CODE_BEFORE__ import { SvSurfaceModal, SvSurfacePopover,Test} from "${ libName }" __CODE_AFTER__`, [ 'SvSurfaceModal', 'SvSurfacePopover' ] ],
      [ `__CODE_BEFORE__ import {
  SvSurfaceModal,
  SvSurfacePopover,
  Test
} from "${ libName }" __CODE_AFTER__`, [ 'SvSurfaceModal', 'SvSurfacePopover' ] ],
    ];

    it('should not transform files other than /vue|[jt]sx?/', () => {
      const { transform } = viteImportCssPlugin();

      expect.soft(transform(codeGood[ 0 ][ 0 ], 'test.md')).toEqual(codeGood[ 0 ][ 0 ]);
    });

    it('should transform CSS imports for matching components', () => {
      const { transform } = viteImportCssPlugin({
        resolver: (path: string) => path,
      });

      for (const code of codeGood) {
        expect.soft(transform(code[ 0 ], 'test.js'))
          .toEqual(`${ code[ 1 ].map((s) => `import '${ libName }/styles/components/${ s }.css';`).join('\n') }\n${ code[ 0 ] }`);
      }
    });

    it('should transform SASS imports for matching components', () => {
      const { transform } = viteImportCssPlugin({
        resolver: (path: string) => path,
        sass: true,
      });

      for (const code of codeGood) {
        expect.soft(transform(code[ 0 ], 'test.js'))
          .toEqual(`${ code[ 1 ].map((s) => `import '${ libName }/src/components/${ s }/index.sass';`).join('\n') }\n${ code[ 0 ] }`);
      }
    });

    it('should transform imports when there is no resolver', () => {
      const { transform } = viteImportCssPlugin({
        resolver: undefined,
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      for (const code of codeGood) {
        expect.soft(transform(code[ 0 ], 'test.js'))
          .toEqual(`${ code[ 1 ].map((s) => `import '${ libName }/styles/components/${ s }.css';`).join('\n') }\n${ code[ 0 ] }`);
        expect.soft(consoleWarnSpy).not.toHaveBeenCalled();
      }

      vi.restoreAllMocks();
    });

    it('should transform imports for matching components that load multiple styles', () => {
      const { transform } = viteImportCssPlugin({
        resolver: (path: string) => path,
        transform(defaultTransform, componentName) {
          return [
            ...defaultTransform(componentName),
            `themes/testTheme/components/${ componentName }.css`,
          ];
        },
      });

      for (const code of codeGood) {
        expect.soft(transform(code[ 0 ], 'test.js'))
          .toEqual(`${ code[ 1 ].map((s) => `import '${ libName }/styles/components/${ s }.css';\nimport 'themes/testTheme/components/${ s }.css';`).join('\n') }\n${ code[ 0 ] }`);
      }
    });

    it('should not transform imports for not found style', () => {
      const { transform } = viteImportCssPlugin({
        resolver: () => { throw new Error('Not found'); },
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      for (const code of codeGood) {
        expect.soft(transform(code[ 0 ], 'test.js'))
          .toEqual(code[ 0 ]);
        expect.soft(consoleWarnSpy).toHaveBeenLastCalledWith(expect.stringContaining('[ VitePluginImportCss ] Not found'));
      }

      vi.restoreAllMocks();
    });

    it('should not transform imports for non-matching components', () => {
      const { transform } = viteImportCssPlugin({
        resolver: (path: string) => path,
      });

      for (const code of codeBad) {
        expect.soft(transform(code[ 0 ], 'test.js'))
          .toEqual(`${ code[ 1 ].map((s) => `import '${ libName }/styles/components/${ s }.css';`).join('\n') }${ code[ 1 ].length > 0 ? '\n' : '' }${ code[ 0 ] }`);
      }
    });
  });
});
