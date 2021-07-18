/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as React from 'react';

describe('Landing Page', () => {
  let ReactDOM = require('react-dom');
  let { App } = require('./app');
  let reportWebVitals = require('./report-web-vitals');

  afterEach(() => {
    jest.resetModules();

    ReactDOM = require('react-dom');
    App = require('./app').App;
    reportWebVitals = require('./report-web-vitals');
  });

  it('should render when starting empty', () => {
    const rootElement = {
      hasChildNodes: () => false,
    } as HTMLElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(rootElement);
    jest.spyOn(ReactDOM, 'render').mockImplementation();

    require('.');

    expect(ReactDOM.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      rootElement
    );
  });

  it('should hydrate when pre-rendered', () => {
    const rootElement = {
      hasChildNodes: () => true,
    } as HTMLElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(rootElement);
    jest.spyOn(ReactDOM, 'hydrate').mockImplementation();

    require('.');

    expect(ReactDOM.hydrate).toHaveBeenCalledWith(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      rootElement
    );
  });

  it('should report web vitals', () => {
    const rootElement = {
      hasChildNodes: () => false,
    } as HTMLElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(rootElement);
    jest.spyOn(ReactDOM, 'render').mockImplementation();
    jest.spyOn(reportWebVitals, 'reportWebVitals');

    require('.');

    expect(reportWebVitals.reportWebVitals).toHaveBeenCalledTimes(1);
  });
});
