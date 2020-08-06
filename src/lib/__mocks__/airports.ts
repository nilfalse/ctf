const originalModule = jest.requireActual('../airports');

jest
  .spyOn(originalModule, 'load')
  .mockImplementation(() =>
    Promise.resolve(require('../../../data/airports.json'))
  );

module.exports = originalModule;
