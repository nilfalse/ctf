const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment')
  .default;

class CustomJestEnvironment extends PlaywrightEnvironment {
  async setup() {
    await super.setup();

    await this._ensureBackgroundPageIsLoaded();
  }

  async teardown() {
    await this.global.context.close();

    await super.teardown();
  }

  async _ensureBackgroundPageIsLoaded() {
    if (this.global.context.backgroundPages().length === 0) {
      await this.global.context.waitForEvent('backgroundpage');
    }
  }
}

module.exports = CustomJestEnvironment;
