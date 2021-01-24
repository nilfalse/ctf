const harnessSetUp = Symbol('ctf_harness');

export function stub() {
  let doubleInvocation = false;

  beforeEach(() => {
    if (globalThis.chrome[harnessSetUp]) {
      doubleInvocation = true;
    } else {
      globalThis.chrome[harnessSetUp] = true;
    }
  });

  beforeEach(() => {
    if (doubleInvocation) {
      return;
    }

    Object.assign(globalThis.chrome, {
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
  });

  afterEach(() => {
    if (doubleInvocation) {
      return;
    }

    delete globalThis.chrome[harnessSetUp];
  });

  return globalThis.chrome;
}
