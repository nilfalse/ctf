// https://twitter.com/LeaVerou/status/1241619866475474946

// https://stackoverflow.com/a/28692538/725901
export const char = (content: string, size = 256) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <text x="50%" y="50%" font-size="${size}" dominant-baseline="central" text-anchor="middle">${content}</text>
</svg>
`;

export function toDataURI(content: string) {
  return (
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(content)))
  );
}
