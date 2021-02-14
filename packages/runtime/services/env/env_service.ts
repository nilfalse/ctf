const isFirefox = typeof InstallTrigger !== 'undefined';

export const supportsResolveDNS = isFirefox;

// https://stackoverflow.com/a/53645137/725901
export const supportsActionSVG = isFirefox;
