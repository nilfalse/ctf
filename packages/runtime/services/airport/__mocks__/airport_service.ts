const originalModule = jest.requireActual('../airport_service');

originalModule.rewire$_load(() =>
  Promise.resolve(require('../../../../bundle/data/airports.json'))
);

module.exports = originalModule;
