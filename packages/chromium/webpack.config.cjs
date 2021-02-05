const path = require('path');

const bundler = require('bundler');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

class ChromiumBundle extends bundler.Bundle {
  get path() {
    return path.resolve(__dirname, 'bundle');
  }

  get extra() {
    return merge(
      {
        plugins: [
          new webpack.ProvidePlugin({
            browser: ['webextension-polyfill-ts', 'browser'],
          }),
        ],
      },
      super.extra
    );
  }
}

class ChromiumManifestFactory extends bundler.ManifestFactory {
  create(bundle, _, entrypoints) {
    const manifest = super.create(bundle, _, entrypoints);

    if (bundle.devServer) {
      manifest.content_security_policy = [
        `script-src 'self' 'unsafe-eval' http://localhost:${bundle.devServer.port}`,
        "object-src 'self'",
      ].join('; ');
    }

    return manifest;
  }
}

class BackgroundEntrypoint extends bundler.BackgroundEntrypoint {
  getManifestFactory() {
    return new ChromiumManifestFactory();
  }
}

module.exports = function (env) {
  const bundle = new ChromiumBundle(env);

  bundle.addEntrypoint(new BackgroundEntrypoint(bundle));
  bundle.addEntrypoint(new bundler.UIEntrypoint(bundle));

  return bundle.run();
};
