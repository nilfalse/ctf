import * as debug from './debug';
import * as app from './mediator';

jest.mock('./debug');

function resetObservers() {
  app.observers.length = 0;
}

function createCommandClass<T>() {
  return class {
    arg?: T;
    constructor(arg?: T) {
      this.arg = arg;
    }

    execute() {
      return Promise.resolve(this.arg);
    }
  };
}

describe('App mediator', () => {
  beforeEach(resetObservers);

  it('should subscribe to a command', async () => {
    const FakeCommand = createCommandClass();
    const spy = jest.fn();

    app.subscribe(FakeCommand, spy);
    await app.publish(new FakeCommand());

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should notify only relevant listeners', async () => {
    const FakeCommand1 = createCommandClass();
    const spy1 = jest.fn();
    app.subscribe(FakeCommand1, spy1);

    const FakeCommand2 = createCommandClass();
    const spy2 = jest.fn();
    app.subscribe(FakeCommand2, spy2);

    await app.publish(new FakeCommand1());

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should subscribe multiple listeners to the same command', async () => {
    const FakeCommand = createCommandClass();
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    app.subscribe(FakeCommand, spy1);
    app.subscribe(FakeCommand, spy2);
    await app.publish(new FakeCommand());

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  describe('publish', () => {
    it('should invoke all observers in parallel', () => {
      const FakeCommand = createCommandClass();

      let done: (value?: unknown) => void;
      const spy1 = jest.fn().mockReturnValue(
        new Promise((resolve) => {
          done = resolve;
        })
      );
      app.subscribe(FakeCommand, spy1);

      const spy2 = jest.fn(() => Promise.resolve().then(done));
      app.subscribe(FakeCommand, spy2);

      return app.publish(new FakeCommand());
    });

    it('should return an array of all observer results', async () => {
      const FakeCommand = createCommandClass();

      const retVal1 = Symbol(1);
      app.subscribe(
        FakeCommand,
        jest.fn().mockReturnValue(Promise.resolve(retVal1))
      );

      const retVal2 = Symbol(2);
      app.subscribe(
        FakeCommand,
        jest.fn().mockReturnValue(Promise.resolve(retVal2))
      );

      return expect(app.publish(new FakeCommand())).resolves.toStrictEqual([
        retVal1,
        retVal2,
      ]);
    });
  });

  describe('when command throws', () => {
    it('should not notify any observers', async () => {
      const FakeCommand1 = createCommandClass();
      const spy1 = jest.fn();
      app.subscribe(FakeCommand1, spy1);

      const FakeCommand2 = createCommandClass();
      const spy2 = jest.fn();
      app.subscribe(FakeCommand2, spy2);

      await app.publish(new FakeCommand1(Promise.reject(new Error('test'))));

      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });

    it('should report error to debug.error()', async () => {
      const FakeCommand = createCommandClass();
      const error = new Error('test');

      app.subscribe(FakeCommand, jest.fn());

      await app.publish(new FakeCommand(Promise.reject(error)));

      expect(debug.error).toHaveBeenCalledWith(error);
    });
  });

  describe('when observer throws', () => {
    it('should report error to debug.error()', async () => {
      const FakeCommand = createCommandClass();
      const error = new Error('test');
      const spy = jest.fn().mockReturnValue(Promise.reject(error));

      app.subscribe(FakeCommand, spy);

      await app.publish(new FakeCommand());

      expect(debug.error).toHaveBeenCalledWith(error);
    });

    it('should still invoke other observers', async () => {
      const FakeCommand = createCommandClass();

      app.subscribe(
        FakeCommand,
        jest.fn().mockReturnValue(Promise.reject(new Error('test')))
      );

      const spy = jest.fn();
      app.subscribe(FakeCommand, spy);

      await app.publish(new FakeCommand());

      expect(spy).toHaveBeenCalled();
    });
  });
});
