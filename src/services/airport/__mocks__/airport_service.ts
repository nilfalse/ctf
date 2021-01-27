const originalModule = jest.requireActual('../airport_service');

originalModule.rewire$_load(() =>
  Promise.resolve(require('../../../../data/airports.json'))
);

module.exports = originalModule;
