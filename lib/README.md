# SmartVui (@pdanpdan/smartvui)

[![License: MIT](https://img.shields.io/github/license/pdanpdan/smartvui?style=for-the-badge)](https://opensource.org/licenses/MIT) &nbsp;
[![minzip](https://img.shields.io/bundlephobia/minzip/@pdanpdan/smartvui/latest?style=for-the-badge)](https://bundlephobia.com/result?p=@pdanpdan/smartvui) &nbsp;
![github release](https://img.shields.io/github/v/tag/pdanpdan/smartvui?sort=semver&style=for-the-badge) &nbsp;
![jsdelivr hits](https://img.shields.io/jsdelivr/gh/hm/pdanpdan/smartvui?style=for-the-badge) &nbsp;
![npm release](https://img.shields.io/npm/v/@pdanpdan/smartvui?style=for-the-badge) &nbsp;
![npm downloads](https://img.shields.io/npm/dm/@pdanpdan/smartvui?style=for-the-badge) &nbsp;

## Project description

Components for Vue3 - Material Design 3.

[Docs and examples](https://pdanpdan.github.io/smartvui/)

[Source code, Issues, Discussions](https://github.com/pdanpdan/smartvui)

## Install

```bash
pnpm i @pdanpdan/smartvui
```
or
```bash
yarn add @pdanpdan/smartvui
```
or
```bash
npm install @pdanpdan/smartvui
```

## Development

### Install the dependencies

```bash
pnpm i
```

### Start development mode (hot-code reloading, error reporting, etc.)

```bash
cd dev
pnpm dev
cd ..
```

### Lint the files

```bash
pnpm lint
```

### Build for production

```bash
cd lib
pnpm build
cd ..
```

## Source code, issues, bug reports, feature requests

[SmartVui (smartvui)](https://github.com/pdanpdan/smartvui)

## Author

* Name: Dan Popescu (PDan)
* Email: [pdan.popescu@gmail.com](mailto:pdan.popescu@gmail.com)
* Website: https://github.com/pdanpdan/
* Github: [@pdanpdan](https://github.com/pdanpdan)

## License

Copyright © 2023-present [Dan Popescu](https://github.com/pdanpdan).

This application is distributed under [![License: MIT](https://img.shields.io/github/license/pdanpdan/smartvui?style=for-the-badge)](https://opensource.org/licenses/MIT), see LICENSE for more information.

## Scripts

```bash
# Start dev server and rebuild lib on change
cd dev
pnpm dev
cd ..
# Build lib
cd lib
pnpm build
cd ..
# Run unit test
cd lib
pnpm test
cd ..
# Run unit test and display test coverage
cd lib
pnpm coverage
cd ..
# Lint
pnpm lint
# Run vue-tsc for each repo
cd lib
pnpm typecheck
cd ..
# Release your lib by release-it
cd lib
pnpm release
cd ..
```
