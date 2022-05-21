# laravel-mix-twig

[![npm](https://img.shields.io/npm/v/@webrgp/laravel-mix-twig)](https://www.npmjs.com/package/@webrgp/laravel-mix-twig) [![npm](https://img.shields.io/npm/dm/@webrgp/laravel-mix-twig)](https://www.npmjs.com/package/@webrgp/laravel-mix-twig) [![GitHub issues](https://img.shields.io/github/issues/webrgp/laravel-mix-twig)](https://github.com/webrgp/laravel-mix-twig/issues) [![GitHub license](https://img.shields.io/github/license/webrgp/laravel-mix-twig)](https://github.com/webrgp/laravel-mix-twig/blob/main/LICENSE)

Laravel Mix extension to compile Twig templates to HTML

## Install

```bash
npm install @webrgp/laravel-mix-twig --save-dev
```

## Features

This extension performs following tasks

- Collect files name not start with `_` or under `_*` directory
- Finally, render twig to html

## Usage

```javascript
const mix = require('laravel-mix')
require('@webrgp/laravel-mix-twig')

mix.twig('src/templates', 'public', {
  // data: {},
  // debug: false,
  // trace: false,
})
```

- `data` - Global data passed to all templates
- `debug` - [true|false] enables debug info logging (defaults to false)
- `trace` - [true|false] enables tracing info logging (defaults to false)

For more info about Twig, check [https://twig.symfony.com/doc/3.x/](https://twig.symfony.com/doc/3.x/)
