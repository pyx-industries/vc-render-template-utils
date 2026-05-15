import { MultibaseDigest } from '@uncefact/untp-utils';

import { generateDigestMultibase } from '../../digest/multibase';

describe('generateDigestMultibase', () => {
  const content = '<div>{{name}}</div>';

  it('defaults to a base58btc-encoded sha2-256 digest', async () => {
    const encoded = await generateDigestMultibase(content);

    expect(encoded.startsWith('z')).toBe(true);

    const parsed = MultibaseDigest.fromString(encoded);
    expect(parsed.algorithm).toBe('sha2-256');
    expect(parsed.base).toBe('base58btc');
  });

  it('produces a digest that verifies against the original content bytes', async () => {
    const encoded = await generateDigestMultibase(content);
    const parsed = MultibaseDigest.fromString(encoded);

    await expect(
      parsed.verify(new TextEncoder().encode(content)),
    ).resolves.toBe(true);
  });

  it('supports overriding the hash algorithm', async () => {
    const encoded = await generateDigestMultibase(content, {
      algorithm: 'sha2-512',
    });

    const parsed = MultibaseDigest.fromString(encoded);
    expect(parsed.algorithm).toBe('sha2-512');
  });

  it('supports overriding the multibase encoding', async () => {
    const encoded = await generateDigestMultibase(content, {
      base: 'base64',
    });

    expect(encoded.startsWith('m')).toBe(true);

    const parsed = MultibaseDigest.fromString(encoded);
    expect(parsed.base).toBe('base64');
  });

  it('throws on an unsupported algorithm', async () => {
    await expect(
      generateDigestMultibase(content, {
        algorithm: 'md5' as never,
      }),
    ).rejects.toThrow(/Unsupported hash algorithm/);
  });

  it('throws on an unsupported multibase encoding', async () => {
    await expect(
      generateDigestMultibase(content, {
        base: 'base32' as never,
      }),
    ).rejects.toThrow(/Unsupported multibase encoding/);
  });

  it('produces identical output for identical content', async () => {
    const a = await generateDigestMultibase(content);
    const b = await generateDigestMultibase(content);
    expect(a).toBe(b);
  });

  it('produces different output for different content', async () => {
    const a = await generateDigestMultibase('one');
    const b = await generateDigestMultibase('two');
    expect(a).not.toBe(b);
  });

  it('hashes the UTF-8 byte representation of non-ASCII content', async () => {
    const nonAscii = 'café au lait \u{1F4A1}';
    const encoded = await generateDigestMultibase(nonAscii);
    const parsed = MultibaseDigest.fromString(encoded);

    await expect(
      parsed.verify(new TextEncoder().encode(nonAscii)),
    ).resolves.toBe(true);
  });
});
