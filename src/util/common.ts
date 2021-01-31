export function isKeyof<T extends Record<string, unknown>>(
  obj: T,
  possibleKey: string | number | symbol
): possibleKey is keyof T {
  return possibleKey in obj;
}

export function lookupUpperCase<T>(dict: Record<string, T>, key: string): T;
export function lookupUpperCase<T>(dict: Record<string, T>, key: string): null;
export function lookupUpperCase<T>(dict: Record<string, T>, key: string) {
  key = key.toUpperCase();
  if (isKeyof(dict, key)) {
    return dict[key];
  }

  return null;
}
