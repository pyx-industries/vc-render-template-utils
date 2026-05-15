# Changelog

All notable changes to `@pyx-industries/vc-render-template-utils` are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/)
and the version numbers follow [semantic versioning](https://semver.org/).
The package ships via the `v<X.Y.Z>` tag-triggered publish workflow described
in [ADR 001](./docs/adrs/001-trunk-based-development-and-tag-triggered-releases.md).

## [2.1.0] - 2026-05-15

### Added

- `constructRenderMethodAsync`: asynchronous counterpart to
  `constructRenderMethod` that auto-fills `digestMultibase` for
  `RenderTemplate2024` outputs when `extra.url` is a non-empty string, the
  source `template` is non-empty, and the caller has not pre-supplied a
  `digestMultibase`. The synchronous `constructRenderMethod` is unchanged.
- `generateDigestMultibase(content, opts?)`: primitive that hashes the UTF-8
  bytes of `content` and returns a multibase-encoded multihash string.
  Defaults to `sha2-256` and `base58btc`; both configurable. Built on
  [`@uncefact/untp-utils`](https://www.npmjs.com/package/@uncefact/untp-utils).
- `DEFAULT_DIGEST_ALGORITHM` and `DEFAULT_DIGEST_BASE` exported constants for
  callers that want to be explicit about the defaults.

### Changed

- The Jest config now transforms `@uncefact/untp-utils` and `multiformats`
  via `transformIgnorePatterns`, with targeted `moduleNameMapper` entries
  for the `multiformats` subpaths used by the new primitive. Existing tests
  are unaffected.

## [2.0.0] - 2026-05-01

### Changed

- **BREAKING**: `RenderTemplate2024.type` is now `string[]` (must include
  `'RenderTemplate2024'`) rather than a single literal string, matching the
  shape produced and consumed by the downstream vckit renderer.

### Added

- `RenderTemplate2024` now accepts optional `name`, `mediaType`, and
  `digestMultibase` fields via the `extra` argument to `constructRenderMethod`.
  Empty or non-string values are omitted from the constructed render method
  rather than emitted as empty strings.

## [1.1.0] - 2025-05-20

### Added

- `removeLineBreaks` now handles `\r` and consecutive line breaks.
- Template whitespace is normalised before storage so embedded templates
  retain a single space between tokens.

## [1.0.0] - 2025-04-29

### Added

- Initial public release of `constructRenderMethod`, `extractRenderTemplate`,
  and `populateTemplate` for the `RenderTemplate2024` and
  `WebRenderingTemplate2022` render methods, plus the `Handlebars` templating
  engine.
