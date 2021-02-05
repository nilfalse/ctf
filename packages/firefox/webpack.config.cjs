const path = require('path');

const bundler = require('bundler');

class FirefoxBundle extends bundler.Bundle {
  get path() {
    return path.resolve(__dirname, 'bundle');
  }
}

class FirefoxManifestFactory extends bundler.ManifestFactory {
  create(bundle, _, entrypoints) {
    return {
      ...super.create(bundle, _, entrypoints),

      browser_specific_settings: {
        gecko: {
          id: '{4f2a0a00-063e-4a7d-b92e-e352eb1c8424}',
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
