const mix = require('laravel-mix')
require('./src/index')

mix.setPublicPath('tests/public')
mix.version(['tests/public/test.css'])

mix.twig('tests/src', 'tests/public', {
  data: {
    msg: 'Hello World'
  },
  format: 'pretty'
})
