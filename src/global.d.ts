type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: never) => Promise<infer U>
  ? U
  : T extends (...args: never) => infer U
  ? U
  : T;
