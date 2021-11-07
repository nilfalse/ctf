const originalModule = jest.requireActual<{
  rewire$_load: (loader: () => Promise<unknown>) => void;
}>('../airport_service');

originalModule.rewire$_load(() =>
  Promise.resolve(require('../../../../bundle/data/airports.json'))
);

module.exports = originalModule;
