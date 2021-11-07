import assert from 'assert';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import flags from 'country-flag-emoji-json/dist/by-code.json';
import fetch from 'node-fetch';

export function main(binPath, twemojiRoot) {
  const twemoji = new Twemoji(twemojiRoot);

  return twemoji.download().catch((err) => {
    console.error(err);

    process.exit(1);
  });
}

class Twemoji {
  constructor(twemojiRoot) {
    this.twemojiRoot = twemojiRoot;

    this.agent = new https.Agent({ keepAlive: true });
  }

  get flags() {
    return Object.entries(flags).map(
      ([code, flag]) => new TwemojiFlag(code, flag)
    );
  }

  download() {
    return Promise.all(
      this.flags.map((flag) =>
        flag.download(this.agent).then((res) => this._persist(flag, res))
      )
    );
  }

  _persist(flag, response) {
    console.log(`${flag.countryCode} -- ${flag.remoteUrl}`);

    if (response.ok) {
      return response.body.pipe(
        fs.createWriteStream(`${this.twemojiRoot}${flag.localPath}`)
      );
    } else {
      response.headers.forEach((value, name) =>
        console.log(`  ${name}: ${value}`)
      );

      return Promise.reject(
        new Error(`${response.status} ${response.statusText}`)
      );
    }
  }
}

class TwemojiFlag {
  constructor(code, { unicode }) {
    this.unicode = unicode;

    this.countryCode = code.toLowerCase();
    this.localPath = `${path.sep}${this.countryCode}.svg`;
    this.remoteUrl = `https://twemoji.maxcdn.com/v/latest/svg/${this.codepoints}.svg`;
  }

  download(agent) {
    return fetch(this.remoteUrl, {
      agent,
    });
  }

  get codepoints() {
    const codepoints = this.unicode
      .toLowerCase()
      .split(' ')
      .map((codePoint) => {
        assert(
          codePoint.startsWith('u+'),
          `Code point "${codePoint}" does not start with "u+"`
        );

        return codePoint.substring(2);
      });

    return codepoints.join('-');
  }
}
