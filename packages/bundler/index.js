const { Bundle } = require('./bundle');
const { BackgroundEntrypoint } = require('./entrypoints/background');
const { UIEntrypoint } = require('./entrypoints/ui');
const { ManifestFactory } = require('./manifest');

module.exports.Bundle = Bundle;
module.exports.ManifestFactory = ManifestFactory;
module.exports.BackgroundEntrypoint = BackgroundEntrypoint;
module.exports.UIEntrypoint = UIEntrypoint;
