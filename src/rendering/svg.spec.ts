import * as svg from './svg';

describe('SVG rendering subsystem', () => {
  const sizes = [16, 32, 64];
  const emojis = {
    '🙃': 'an emoji',
    '🏁': 'a flag emoji',
    '🇩🇰': 'a country flag emoji',
  };

  describe('when producing content', () => {
    for (const [emoji, description] of Object.entries(emojis)) {
      const SIZE = 128;
      describe(`for ${description}`, () => {
        it('should output valid XML', () => {
          expect(
            new DOMParser().parseFromString(
              svg.content(emoji, SIZE),
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
              svg.content(emoji, size),
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
            const content = svg.content(emoji, size);
            expect(svg.toDataURI(content)).toMatchSnapshot();
          });
        });
      }
    }
  });
});
