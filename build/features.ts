export default function features(env: Record<string, string | undefined>) {
  return function (name: string, cb?: (v: boolean) => unknown) {
    const value = env['FEATURE_' + name];

    if (value === undefined) {
      return undefined;
    }

    if (typeof cb === 'function') {
      cb(value !== '');
    }
    return value !== '';
  };
}
