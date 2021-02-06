const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { ReactEntrypoint } = require('./_react');

class UIEntrypoint extends ReactEntrypoint {
  constructor(bundle) {
    super(bundle);

    this.html = [bundle.popup, bundle.options];
    this._createEntry = this._createEntry.bind(this);
    this._createHtml = this._createHtml.bind(this);
  }

  get configuration() {
    return {
      entry: Object.fromEntries(this.html.map(this._createEntry)),

      ...super.configuration,
    };
  }

  get plugins() {
    return [...super.plugins, ...this.html.map(this._createHtml)];
  }

  _createEntry({ basename }) {
    return [
      basename,
      [
        'react-hot-loader/patch',
        `${this.bundle.runtimePath}/entrypoints/${basename}`,
      ],
    ];
  }

  _createHtml({ basename, filepath, ...options }) {
    return new HtmlWebpackPlugin({
      template: path.resolve(
        this.bundle.runtimePath,
        'entrypoints',
        `${basename}.template.html`
      ),
      filename: filepath,
      chunks: [basename],
      ...options,
    });
  }
}

module.exports.UIEntrypoint = UIEntrypoint;
