# `@pyx-industries/vc-render-template-utils` release notes

User-facing release notes for `@pyx-industries/vc-render-template-utils`.
Each entry frames what the release lets you do, not how it does it. For a
technical, per-change record see [CHANGELOG.md](./CHANGELOG.md).

## 2.0.0 - 2026-05-01

### `RenderTemplate2024` now matches the downstream renderer

The `RenderTemplate2024` interface has been aligned with the shape produced
and consumed by the downstream vckit renderer. Constructed objects now use
`type: ['RenderTemplate2024']` (an array containing the type string) instead
of a single literal, and `constructRenderMethod` accepts the additional
optional fields `name`, `mediaType`, and `digestMultibase` via its `extra`
argument.

This is a breaking change for consumers that previously read
`renderMethod.type` as a literal string; update those call sites to handle
the array form (for example, `renderMethod.type.includes('RenderTemplate2024')`).

## 1.1.0 - 2025-05-20

### Whitespace handling for embedded templates

Template strings supplied to `constructRenderMethod` now have line breaks
removed and runs of whitespace collapsed to a single space before being
stored. This keeps the embedded `template` field compact regardless of how
the source HTML was authored.

## 1.0.0 - 2025-04-29

Initial public release. The package provides three entry points,
`constructRenderMethod`, `extractRenderTemplate`, and `populateTemplate`,
supporting the `RenderTemplate2024` and `WebRenderingTemplate2022` render
methods and the `Handlebars` templating engine.
