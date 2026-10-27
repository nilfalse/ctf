export function toImageData(image: CanvasImageSource) {
  const canvas = new OffscreenCanvas(0, 0);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  return function factory(size: number) {
    canvas.width = canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(image, 0, 0, size, size);

    return ctx.getImageData(0, 0, size, size);
  };
}
