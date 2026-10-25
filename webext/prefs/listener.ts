import * as storage from './storage.ts';

export function heed<T = unknown>(name: string, listener: (v?: T) => unknown) {
  storage.onChanged(function handleChanged(changes) {
    if (!changes[name]) {
      return;
    }

    return listener(changes[name].newValue as T | undefined);
  });
}
