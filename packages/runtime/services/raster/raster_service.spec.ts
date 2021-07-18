import * as raster from './raster_service';

describe('Raster service', () => {
  let createElementSpy: jest.SpyInstance;
  beforeEach(() => {
    createElementSpy = jest.spyOn(document, 'createElement');
  });
  afterEach(() => {
    createElementSpy.mockRestore();
  });

  describe('when creating canvas', () => {
    let canvas: HTMLCanvasElement;
    beforeEach(() => {
      const canvasMock = {
        getContext: jest.fn(),
      } as unknown;
      canvas = canvasMock as HTMLCanvasElement;
      createElementSpy.mockReturnValue(canvas);
    });

    it('should set width & height', () => {
      raster.createCanvas({ width: 666, height: 777 });

      expect(canvas).toHaveProperty('width', 666);
      expect(canvas).toHaveProperty('height', 777);
    });

    it('should return 2d context', () => {
      const contextSymbol = Symbol('context') as unknown;
      jest
        .spyOn(canvas, 'getContext')
        .mockReturnValue(contextSymbol as CanvasRenderingContext2D);

      expect(raster.createCanvas({ width: 111, height: 999 })).toBe(
        contextSymbol
      );

      expect(canvas.getContext).toHaveBeenCalledWith('2d');
    });
  });

  describe('when generating ImageData', () => {
    let ImageSpy: jest.SpyInstance;
    beforeEach(() => {
      ImageSpy = jest.spyOn(globalThis, 'Image');
    });
    afterEach(() => {
      ImageSpy.mockRestore();
    });

    it('should create an Image with provided URL', () => {
      const image = new Image();
      ImageSpy.mockReturnValue(image);

      const spy = jest.spyOn(image, 'src', 'set');

      return new Promise<void>((resolve) => {
        spy.mockImplementation((value) => {
          expect(value).toBe('http://localhost/');

          resolve();
        });

        void raster.toImageData('http://localhost/', 16);
      });
    });

    it('should create canvas with loaded image', async () => {
      const image = new Image(16, 16);
      ImageSpy.mockReturnValue(image);
      jest.spyOn(image, 'src', 'set').mockImplementation(() => {
        if (typeof image.onload === 'function') {
          image.onload(new CustomEvent('test'));
        }
      });

      const canvas = document.createElement('canvas');
      createElementSpy.mockReturnValue(canvas);

      const imageData = Symbol('imgData');
      const ctxMock = {
        drawImage: jest.fn(),
        getImageData: jest.fn().mockReturnValue(imageData),
      } as unknown;
      const ctx = ctxMock as CanvasRenderingContext2D;

      jest.spyOn(canvas, 'getContext').mockReturnValue(ctx);
      await expect(raster.toImageData('http://localhost/', 16)).resolves.toBe(
        imageData
      );

      expect(ctx.drawImage).toHaveBeenCalledWith(image, 0, 0);
      expect(ctx.getImageData).toHaveBeenCalledWith(
        0,
        0,
        image.width,
        image.height
      );
    });
  });
});
