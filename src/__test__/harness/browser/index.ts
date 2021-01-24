export function mock() {
  const mock: typeof chrome = ({} as unknown) as typeof chrome;
  let savedChrome: typeof chrome;

  beforeEach(() => {
    Object.assign(mock, {
      runtime: {
        onMessage: { addListener: jest.fn() },
      },
      tabs: {
        onUpdated: { addListener: jest.fn() },
        onRemoved: { addListener: jest.fn() },
      },
      webRequest: {
        onCompleted: { addListener: jest.fn() },
      },

      pageAction: {},
    });

    savedChrome = globalThis.chrome;
    Object.defineProperty(globalThis, 'chrome', {
      writable: true,
      value: mock,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'chrome', {
      writable: true,
      value: savedChrome,
    });
  });

  return mock;
}
