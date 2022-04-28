const mix = require('laravel-mix')
const TwigTask = require('./TwigTask')

class Twig {
  constructor() {
    this.tasks = []
  }

  name() {
    return 'twig'
  }

  register(from, to, options = {}) {
    this.tasks.push(new TwigTask({ from, to, options }))
  }

  /**
   * Boot the component. This method is triggered after the
   * user's webpack.mix.js file has processed.
   */
  boot() {
    /**
     * In order to get the latest hashed assets path in manifest,
     * we need to run our tasks after Mix internal assets
     * versioning task, the Mix `build` event woulbe be a good
     * timing to do that.
     */
    Mix.listen('build', async () => {
      await this.runTasks().then(() => {
        if (Mix.isWatching()) {
          this.tasks.forEach(task => task.watch(Mix.isPolling()))
        }
      })
    })
  }

  /**
   * Execute tasks parallelly
   */
  async runTasks() {
    await Promise.all(this.tasks.map(task => task.run()))
  }

  dependencies() {
    this.requiresReload = true
    return ['chokidar', 'globby', 'twig']
  }
}

mix.extend('twig', new Twig())
