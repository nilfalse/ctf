import { describe, expect, it } from 'vitest';

import * as svg from './svg.ts';

describe('char', () => {
  it('should use size of 256px by default', () =>
    expect(svg.char('🏁')).toContain('viewBox="0 0 256 256"'));

  it('should size the document', () =>
    expect(svg.char('🇩🇰', 32)).toContain('viewBox="0 0 32 32"'));

  it('should center the content', () =>
    expect(svg.char('🇩🇰', 32)).toContain(
      '<text x="50%" y="50%" font-size="32" dominant-baseline="central" text-anchor="middle">🇩🇰</text>',
    ));
});

describe('toDataURL', () => {
  it('should encode the content', () =>
    expect(svg.toDataURL('<svg a="#"/>')).toBe(
      'data:image/svg+xml,%3Csvg%20a%3D%22%23%22%2F%3E',
    ));
});
