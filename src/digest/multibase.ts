import {
  HashAlgorithm,
  MultibaseDigest,
  MultibaseEncoding,
} from '@uncefact/untp-utils';

/**
 * Options accepted by {@link generateDigestMultibase}. Both fields default to
 * the conventional UNTP/W3C-VC choices when omitted.
 */
export interface GenerateDigestMultibaseOptions {
  /** Hash algorithm. Defaults to `sha2-256`. */
  algorithm?: HashAlgorithm;
  /** Multibase encoding for the returned string. Defaults to `base58btc`. */
  base?: MultibaseEncoding;
}

const DEFAULT_ALGORITHM: HashAlgorithm = 'sha2-256';
const DEFAULT_BASE: MultibaseEncoding = 'base58btc';

/**
 * Hashes the UTF-8 bytes of `content` and returns a multibase-encoded
 * multihash string suitable for use as `digestMultibase` on a
 * `RenderTemplate2024` render method (or any other UNTP/W3C-VC field with the
 * same shape).
 *
 * The output is self-describing: the leading character identifies the
 * multibase encoding, and the prefix bytes identify the hash algorithm. A
 * verifier can therefore decode and validate the digest without out-of-band
 * metadata.
 *
 * @param content Source string to hash. Encoded as UTF-8 before hashing.
 * @param opts Optional algorithm and base overrides. See
 *   {@link GenerateDigestMultibaseOptions} for defaults.
 * @returns A multibase-encoded multihash string.
 * @throws If `opts.algorithm` or `opts.base` is not in the
 *   `@uncefact/untp-utils` allow-list.
 *
 * @see https://github.com/multiformats/multihash Multihash specification
 * @see https://github.com/multiformats/multibase Multibase specification
 */
export async function generateDigestMultibase(
  content: string,
  opts: GenerateDigestMultibaseOptions = {},
): Promise<string> {
  const algorithm = opts.algorithm ?? DEFAULT_ALGORITHM;
  const base = opts.base ?? DEFAULT_BASE;

  const digest = await MultibaseDigest.fromData(
    new TextEncoder().encode(content),
    { algorithm, base },
  );

  return digest.toString();
}
