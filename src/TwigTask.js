/*
 * @Author: webrgp
 * @Date: 2022-04-28 09:59:20
 * @Last Modified by: webrgp
 * @Last Modified time: 2022-05-31 13:12:39
 */

const globby = require('globby')
const chokidar = require('chokidar')
const path = require('path')
const Log = require('laravel-mix/src/Log')
const File = require('laravel-mix/src/File')

class TwigTask {
  /**
   * Create a new task instance.
   *
   * @param {object} options
   */
  constructor(options) {
    this.options = options
    this.from = new File(options.from)
    this.to = new File(options.to)
    const { data, base, functions, filters, extend, format, ...rest } =
      options.options
    this.twigOptions = Object.assign(
      {
        base: this.from.relativePath(),
        async: false,
        debug: false,
        trace: false
      },
      rest
    )

    this.data = data || {}

    this.base = this.from.isDirectory()
      ? this.from.path()
      : this.from.segments.base.split('*')[0]

    this.watcher = null
    this.isBeingWatched = false

    this.compiler = require('twig')

    this.compiler.extendFunction('mix', file => {
      const assets = Mix.manifest.get()
      return assets[file] || file
    })

    // Add custom functions
    if (functions?.length > 0) {
      functions.forEach(func => {
        const [name, callback] = func
        if (name && callback) {
          this.compiler.extendFunction(name, callback)
        }
      })
    }

    // Add custom filters
    if (filters?.length > 0) {
      filters.forEach(filter => {
        const [name, callback] = filter
        if (name && callback) {
          this.compiler.extendFilter(name, callback)
        }
      })
    }

    // Add custom tags
    if (extend?.length > 0) {
      extend.forEach(func => {
        this.compiler.extend(func)
      })
    }

    this.compiler.cache(false)

    this.configFormatter(format)
  }

  configFormatter(format = 'pretty') {
    if (format === 'minify') {
      this.formatter = require('html-minifier').minify
      this.formatterOptions = {
        caseSensitive: true,
        collapseWhitespace: true,
        removeComments: true,
        continueOnParseError: true,
        minifyCSS: true,
        minifyJS: true
      }

      return
    }

    if (format === 'pretty') {
      this.formatter = require('js-beautify').html
      this.formatterOptions = {
        indent_size: '2',
        indent_char: ' ',
        max_preserve_newlines: '2',
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'keep',
        brace_style: 'collapse',
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: false,
        wrap_line_length: '0',
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false
      }
      return
    }

    this.formatter = (str, obj) => str
    this.formatterOptions = {}
  }

  run() {
    const patterns = [
      this.from.path(),
      '!' + path.join(this.base, '**/_**/*'),
      '!' + path.join(this.base, '**/_*')
    ]

    const files = globby.sync(patterns, { onlyFiles: true })
    files.forEach(filePath => this.onChange(filePath))
  }

  onChange(updatedFilePath, type = 'change') {
    const srcFile = new File(updatedFilePath)
    let distFile = this.to

    if (distFile.isDirectory()) {
      distFile = distFile.append(
        path.join(
          path.relative(this.base, srcFile.base()),
          srcFile.nameWithoutExtension() + '.html'
        )
      )
    }

    const isPartial = path
      .relative(this.base, updatedFilePath)
      .split('/')
      .some(name => name.startsWith('_'))

    switch (type) {
      case 'change':
      case 'add':
        if (isPartial) {
          this.run()
        } else {
          this.compile(srcFile, distFile)
        }
        break
      case 'unlink':
        if (isPartial) {
          this.run()
        } else {
          destFile.delete()
        }
        break
      case 'unlinkDir':
        if (!isPartial) {
          destFile.delete()
        }
        break
    }
  }

  /**
   * Compile template file
   *
   * @param {File} srcFile
   * @param {File} distFile
   */
  compile(srcFile, distFile) {
    try {
      const options = Object.assign(this.twigOptions, {
        path: srcFile.path()
      })
      const tpl = this.compiler.twig(options)
      let rendered = tpl.render(this.data)

      rendered = this.formatter(rendered, this.formatterOptions)

      distFile.makeDirectories()
      distFile.write(rendered)
    } catch (e) {
      Log.error(e.message || e)
    }
  }

  /**
   * Watch all relevant files for changes
   *
   * @param {boolean} usePolling
   */
  watch(usePolling = false) {
    if (this.isBeingWatched) return

    const options = { usePolling, ignored: /(^|[\/\\])\../ }
    this.watcher = chokidar
      .watch(this.options.from, options)
      .on('all', (eventName, filePath) => {
        this.onChange(filePath, eventName)
      })
    this.isBeingWatched = true
  }
}

module.exports = TwigTask
