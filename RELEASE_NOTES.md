# `@pyx-industries/vc-render-template-utils` release notes

User-facing release notes for `@pyx-industries/vc-render-template-utils`.
Each entry frames what the release lets you do, not how it does it. For a
technical, per-change record see [CHANGELOG.md](./CHANGELOG.md).

## 2.1.0 - 2026-05-15

### `digestMultibase` is generated for you when you opt in

A new asynchronous constructor, `constructRenderMethodAsync`, mirrors
`constructRenderMethod` but auto-fills `digestMultibase` for
`RenderTemplate2024` outputs whenever a `url` is supplied and the template
is non-empty. Existing callers that already compute their own
`digestMultibase` (or that do not want one) are unaffected: the
synchronous `constructRenderMethod` is unchanged, and a non-empty
caller-supplied `digestMultibase` is preserved verbatim.

The gating reflects the spec semantics. A `digestMultibase` only adds
value when the template is hosted remotely, because the signed credential
itself already covers an inline template. The presence of `url` is
treated as the caller's declaration of remote intent, so the digest is
only emitted when the remote path is the source of truth.

### A primitive you can reach for directly

For consumers that need a multibase-encoded multihash outside the render
method flow, `generateDigestMultibase(content, opts?)` is exported as a
standalone primitive. Defaults to `sha2-256` plus `base58btc`, the
conventional UNTP and W3C VC choices. The companion constants
`DEFAULT_DIGEST_ALGORITHM` and `DEFAULT_DIGEST_BASE` are exported for
callers that want to write the defaults out explicitly.

The implementation builds on
[`@uncefact/untp-utils`](https://www.npmjs.com/package/@uncefact/untp-utils),
so the algorithm and encoding choices live in a single place across the
UNTP ecosystem.

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
