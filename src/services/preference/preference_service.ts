export function getValue(prefName: string) {
  if (prefName === 'render') {
    return 'twemoji';
  } else {
    throw new Error(`Unexpected preference name ${prefName}`);
  }
}

export async function init() {
  // noop
}
