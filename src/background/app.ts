import * as debug from '../debug';

interface Command {
  execute(...args: any): Promise<any>;
}

type CommandResult<C extends Command> = Unwrap<ReturnType<C['execute']>>;

export interface Action<C extends Command> {
  (command: C, executionResult: CommandResult<C>): Promise<void>;
}

interface Observer<C extends Command> {
  commandCtor: new (...args: any[]) => C;
  action: Action<C>;
}

export const observers: Observer<Command>[] = [];

export function subscribe<C extends Command>(
  commandCtor: new (...args: any[]) => C,
  action: Action<C>
) {
  debug.assert(typeof action === 'function');

  observers.push({
    commandCtor,
    action: action as Action<Command>,
  });
}

export async function publish(command: Command) {
  let result: any;
  try {
    result = await command.execute();
  } catch (err) {
    debug.error(err);
    return;
  }

  return Promise.all(
    observers.map(async function (observer) {
      try {
        if (command instanceof observer.commandCtor) {
          return await observer.action(command, result);
        }
      } catch (err) {
        debug.error(err);
      }
    })
  );
}
