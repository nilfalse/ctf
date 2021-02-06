import * as svg from './svg_service';

describe('SVG service', () => {
  const sizes = [16, 32, 64];
  const emojis = {
    '🙃': 'an emoji',
    '🏁': 'a flag emoji',
    '🇩🇰': 'a country flag emoji',
  };

  describe('when producing content', () => {
    it('should use size of 256px by default', () => {
      const { documentElement } = new DOMParser().parseFromString(
        svg.char('🏁'),
        'image/svg+xml'
      );

      expect(documentElement.getAttribute('viewBox')).toBe('0 0 256 256');
      expect(documentElement.getAttribute('width')).toBe('256');
      expect(documentElement.getAttribute('height')).toBe('256');
    });

    for (const [emoji, description] of Object.entries(emojis)) {
      const SIZE = 128;
      describe(`for ${description}`, () => {
        it('should output valid XML', () => {
          expect(
            new DOMParser().parseFromString(
              svg.char(emoji, SIZE),
              'image/svg+xml'
            ).documentElement.outerHTML
          ).toMatchSnapshot();
        });
      });
    }

    for (const size of sizes) {
      describe(`with size of ${size}px`, () => {
        for (const [emoji, description] of Object.entries(emojis)) {
          it(`should generate XML for ${description} containing viewBox, width & height of ${size}`, () => {
            const { documentElement } = new DOMParser().parseFromString(
              svg.char(emoji, size),
              'image/svg+xml'
            );

            expect(documentElement.getAttribute('viewBox')).toBe(
              `0 0 ${size} ${size}`
            );

            expect(documentElement.getAttribute('width')).toBe(size.toString());
            expect(documentElement.getAttribute('height')).toBe(
              size.toString()
            );
          });
        }
      });
    }
  });

  describe('when producing data URI', () => {
    for (const size of sizes) {
      for (const [emoji] of Object.entries(emojis)) {
        describe(`with emoji ${emoji} of size ${size}px`, () => {
          it(`should generate expected URI`, () => {
            const content = svg.char(emoji, size);
            expect(svg.toDataURI(content)).toMatchSnapshot();
          });
        });
      }
    }
  });
});
