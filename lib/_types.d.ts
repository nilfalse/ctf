type ThreeUppercaseLetters =
  `${UppercaseLetter}${UppercaseLetter}${UppercaseLetter}`;

type TwoUppercaseLetters = `${UppercaseLetter}${UppercaseLetter}`;

type UppercaseLetter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

type AssertNever<T extends never> = T;

type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T as T[K]]: K;
};

// Keys that share a value with some other key
type Collisions<T> = {
  [K in keyof T]: {
    [J in keyof T]: J extends K ? never : T[J] extends T[K] ? J : never;
  }[keyof T];
}[keyof T];
