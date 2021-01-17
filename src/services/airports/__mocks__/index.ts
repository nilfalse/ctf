const originalModule = jest.requireActual('..');

jest
  .spyOn(originalModule, 'load')
  .mockImplementation(() =>
    Promise.resolve(require('../../../../data/airports.json'))
  );

module.exports = originalModule;
