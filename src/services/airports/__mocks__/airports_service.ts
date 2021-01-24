const originalModule = jest.requireActual('../airports_service');

originalModule.rewire$_load(() =>
  Promise.resolve(require('../../../../data/airports.json'))
);

module.exports = originalModule;
