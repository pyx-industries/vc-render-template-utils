# Changelog

All notable changes to `@pyx-industries/vc-render-template-utils` are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/)
and the version numbers follow [semantic versioning](https://semver.org/).
The package ships via the `v<X.Y.Z>` tag-triggered publish workflow described
in [ADR 001](./docs/adrs/001-trunk-based-development-and-tag-triggered-releases.md).

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
