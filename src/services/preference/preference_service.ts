export function getValue(prefName: 'render'): 'emoji' | 'twemoji';
export function getValue(prefName: string): string;
export function getValue(prefName: string) {
  if (prefName === 'render') {
    return 'emoji';
  } else {
    throw new Error(`Unexpected preference name ${prefName}`);
  }
}

export async function init() {
  // noop
}
