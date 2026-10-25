// https://x.com/LeaVerou/status/1241619866475474946
export function char(content: string, size = 256) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <text x="50%" y="50%" font-size="${size}" dominant-baseline="central" text-anchor="middle">${content}</text>
</svg>
`;
}

export function toDataURL(content: string) {
  return 'data:image/svg+xml,' + encodeURIComponent(content);
}
