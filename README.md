# laravel-mix-twig

[![npm](https://img.shields.io/npm/v/@webrgp/laravel-mix-twig)](https://www.npmjs.com/package/@webrgp/laravel-mix-twig) [![npm](https://img.shields.io/npm/dm/@webrgp/laravel-mix-twig)](https://www.npmjs.com/package/@webrgp/laravel-mix-twig) [![GitHub issues](https://img.shields.io/github/issues/webrgp/laravel-mix-twig)](https://github.com/webrgp/laravel-mix-twig/issues) [![GitHub license](https://img.shields.io/github/license/webrgp/laravel-mix-twig)](https://github.com/webrgp/laravel-mix-twig/blob/main/LICENSE)

Laravel Mix extension to compile Twig templates to HTML

## Usage

Install the extension:

```bash
npm install @webrgp/laravel-mix-twig --save-dev
```

Then require and configure the extension within your webpack.mix.js.

## Simple configuration

```javascript
const mix = require('laravel-mix')
require('@webrgp/laravel-mix-twig')

// mix.twig('your source folder', 'your dist or public folder', {your advance configuration})
mix.twig('src/templates', 'public')
```

### Underscore to ignore

Files or folders prefixed with an underscore are ignored from html output. This is a handy feature for ignoring component and layout files.

```
Ignored files:
/_components/header.twig
/_layouts/base.twig
/_include.twig
```

## Options

| Name        | Type     | Default | Description                                                                                                                                                    |
| ----------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| files \*    | `string` | ``      | Paths to your twig source files (supports [minimatch](https://github.com/isaacs/minimatch#usage))<br>OR<br> An array of objects to pass to html-webpack-plugin |
| fileBase \* | `string` | ``      | The base path to your template folder                                                                                                                          |
| options     | `object` | `{}`    | Customizations options                                                                                                                                         |

\*&nbsp;= Required

These are the folowing options you can pass:

### Data

Set global variables like this:

```js
mix.twig('src/templates', 'public', {
  data: {
    msg: 'Hello World'
  }
})
```

That will be available to all templates:

```twig
<h1>{{ msg }}<h1/>
```

### Debug & Trace

Enables debug or trace info logging (defaults to false)

```js
mix.twig('src/templates', 'public', {
  debug: true,
  trace: true
})
```

### Functions

Custom functions can be added through `{ functions: [ [String, Callback] ] }`

For example, a function that repeats a string could look like:

```js
mix.twig('src/templates', 'public', {
  functions: [
    [
      'repeat',
      function (value, times) {
        return new Array(times + 1).join(value)
      }
    ]
  ]
})
```

And you can use it in a template like:

```twig
{{ repeat("_.", 10) }}
{# output: _._._._._._._._._._. #}
```

### Filters

Custom filters can be added through `{ filters: [ [String, Callback] ] }`

For example, if you wanted to add a filter that reversed words in a sentence, you could do the following:

```js
mix.twig('src/templates', 'public', {
  filters: [
    [
      'backwords',
      function (stringValue) {
        return stringValue.split(' ').reverse().join(' ')
      }
    ]
  ]
})
```

Then, in your templates you can use:

```twig
{{ "a quick brown fox"|backwords }}
{# outputs: fox brown quick a #}
```

Custom filters with arguments are also supported:

```js
mix.twig('src/templates', 'public', {
  filters: [
    [
      'catify',
      function (value, args) {
        return args.reduce(
          (newString, toCatify) => newString.replace(toCatify, 'cat'),
          value
        )
      }
    ]
  ]
})
```

```twig
{{ "the quick brown fox jumps over the lazy dog"|catify('fox', 'dog') }}
{# outputs: the quick brown cat jumps over the lazy cat #}
```

### Extends Twig with new tags types

Custom tags can be added through `{ extend: [ function(Twig) ] }` where the Twig argument is Twig.js's internal object. [Read more here](https://github.com/twigjs/twig.js/wiki/Extending-twig.js-With-Custom-Tags).

## Built in helpers

For pratical purposes, I've included the following custom functions and filters that can be overwritten using the `functions` and `filters` options.

| Name  | Description                                                                             |
| ----- | --------------------------------------------------------------------------------------- |
| `mix` | The `{{ mix(string) }}` function returns the related entry in `mix-manifest.json` file. |
