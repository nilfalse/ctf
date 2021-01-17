// https://twitter.com/LeaVerou/status/1241619866475474946

// https://stackoverflow.com/a/28692538/725901
export const content = (emoji: string, size = 256) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <text y=".85em" font-size="${size}">${emoji}</text>
</svg>
`;

export function toDataURI(content: string) {
  return (
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(content)))
  );
}
