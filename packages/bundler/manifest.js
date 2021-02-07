class ManifestFactory {
  get icons() {
    return {
      32: 'icons/icon_32px.png',
      48: 'icons/icon_48px.png',
      128: 'icons/icon_128px.png',
      256: 'icons/icon_256px.png',
      512: 'icons/icon_512px.png',
    };
  }

  create(bundle, _, entrypoints) {
    const { author, version } = bundle.pkg;

    return {
      manifest_version: 2,

      name: '__MSG_ext_name__',
      version,

      default_locale: 'en',
      description: '__MSG_ext_description__',
      icons: this.icons,

      page_action: {
        default_icon: this.icons,
        default_popup: bundle.popup.filepath,
        show_matches: ['<all_urls>'],
      },
      options_ui: {
        page: bundle.options.filepath,
        open_in_tab: false,
      },

      author,
      background: {
        scripts: entrypoints.background,
      },

      minimum_chrome_version: '36',

      permissions: ['webRequest', '<all_urls>', 'storage'],

      short_name: '__MSG_ext_short_name__',
      version_name: this._getVersionTag(bundle.pkg),
    };
  }

  _getVersionTag(pkg) {
    const { GITHUB_SHA } = process.env;
    const { version } = pkg;

    return GITHUB_SHA && `${version} (${GITHUB_SHA.substring(0, 8)})`;
  }
}

module.exports.ManifestFactory = ManifestFactory;
