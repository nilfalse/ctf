import * as storage from '~/webext/prefs/storage.ts';
import * as runtime from '~/webext/runtime.ts';

// Lazy
export const prefs = () => (_cache ??= new Prefs().init());

class Defaults {
  icons: 'native' | 'twemoji' = 'twemoji';

  /** @deprecated */
  declare render?: 'emoji' | 'twemoji';
}

class Prefs extends Defaults {
  async init() {
    return Object.assign(this, await storage.get());
  }

  async save<K extends keyof Defaults>(k: K, v: this[K]) {
    this[k] = v;

    if (v === new Defaults()[k]) {
      await storage.remove([k]);
    } else {
      await storage.set({ [k]: v });
    }
  }

  async migrate() {
    if (this.render === undefined) {
      return;
    }

    const { os } = await runtime.getPlatform();

    if (this.render === 'emoji' && os !== 'win') {
      await this.save('icons', 'native');
    }

    await this.save('render', undefined);
  }
}

let _cache: Promise<Prefs> | undefined;
// Register on import
storage.onChanged(() => (_cache = undefined));
