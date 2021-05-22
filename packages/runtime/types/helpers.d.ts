type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: never) => Promise<infer U>
  ? U
  : T extends (...args: never) => infer U
  ? U
  : T;
