module.exports = (api) => {
  const presets = ['@babel/preset-typescript'];

  const isDevelopment = api.env('development');
  if (!isDevelopment) {
    const isTest = api.env('test');

    presets.push([
      '@babel/preset-env',
      {
        targets: isTest
          ? { node: 'current' }
          : { browsers: 'last 2 Chrome versions' },
      },
    ]);
  }

  presets.push(['@babel/preset-react', { runtime: 'automatic' }]);

  return {
    presets,
  };
};
