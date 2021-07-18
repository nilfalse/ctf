const originalModule = jest.requireActual<{
  // eslint-disable-next-line camelcase
  rewire$_load: (loader: () => Promise<unknown>) => void;
}>('../airport_service');

originalModule.rewire$_load(() =>
  Promise.resolve(require('../../../../bundle/data/airports.json'))
);

module.exports = originalModule;
