const path = require('path');

const bundler = require('bundler');

class FirefoxBundle extends bundler.Bundle {
  get path() {
    return path.resolve(__dirname, 'bundle');
  }
}

class FirefoxManifestFactory extends bundler.ManifestFactory {
  create(bundle, _, entrypoints) {
    const manifest = super.create(bundle, _, entrypoints);

    return {
      ...manifest,

      page_action: {
        ...manifest.page_action,
        show_matches: undefined,
      },

      permissions: ['dns', ...manifest.permissions],

      browser_specific_settings: {
        gecko: {
          id: '@ctf',
        },
      },
    };
  }
}

class BackgroundEntrypoint extends bundler.BackgroundEntrypoint {
  getManifestFactory() {
    return new FirefoxManifestFactory();
  }
}

module.exports = function (env) {
  const bundle = new FirefoxBundle(env);

  bundle.addEntrypoint(new BackgroundEntrypoint(bundle));
  bundle.addEntrypoint(new bundler.UIEntrypoint(bundle));

  return bundle.run();
};
