export function isKeyof<T extends object>(
  obj: T,
  possibleKey: keyof any
): possibleKey is keyof T {
  return possibleKey in obj;
}

export function lookupUpperCase<T>(dict: { [key: string]: T }, key: string) {
  key = key.toUpperCase();
  if (isKeyof(dict, key)) {
    return dict[key];
  }

  return null;
}
