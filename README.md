# vc-render-template-utils

A lightweight utility library for constructing, extracting and rendering verifiable credential render templates.

## Installation

Install the package:

```bash
# Yarn
yarn add @pyx-industries/vc-render-template-utils

# NPM
npm install @pyx-industries/vc-render-template-utils
```

## Usage

### Basic Example

```typescript
import {
  constructRenderMethod,
  extractRenderTemplate,
  populateTemplate,
  RenderMethodType,
  TemplatingEngineType,
} from '@pyx-industries/vc-render-template-utils';

// Construct a render method
const template = '<div>Hello, {{name}}!</div>';
const renderMethod = constructRenderMethod(
  template,
  RenderMethodType.RenderTemplate2024,
);

// Extract the template
const extractedTemplate = await extractRenderTemplate(renderMethod);

// Populate the template with data
const data = { name: 'World' };
const result = populateTemplate(
  TemplatingEngineType.Handlebars,
  extractedTemplate,
  data,
);

console.log(result); // Output: <div>Hello, World!</div>
```

### Advanced Example with URL Fetching

```typescript
import {
  constructRenderMethod,
  extractRenderTemplate,
  populateTemplate,
  RenderMethodType,
  TemplatingEngineType,
} from '@pyx-industries/vc-render-template-utils';

// Construct a render method with a URL
const renderMethod = constructRenderMethod(
  '',
  RenderMethodType.RenderTemplate2024,
  { url: 'http://example.com/template.html' },
);

// Extract the template from the URL
const extractedTemplate = await extractRenderTemplate(renderMethod);

// Populate the template
const data = { title: 'My Page' };
const result = populateTemplate(
  TemplatingEngineType.Handlebars,
  extractedTemplate,
  data,
);

console.log(result); // Output: Rendered template content
```

## API

### constructRenderMethod

```typescript
constructRenderMethod(template: string, renderMethodType: RenderMethodType, extra?: Record<string, unknown>)
```

Constructs a render method object for the specified template and type.

- `template`: The template string or empty if using a URL.
- `renderMethodType`: Either `RenderTemplate2024` or `WebRenderingTemplate2022`.
- `extra`: Optional metadata. For `RenderTemplate2024` the supported keys are `name`, `mediaQuery`, `url`, `mediaType`, and `digestMultibase`. Empty or non-string values are omitted from the constructed render method rather than emitted as empty strings.

### constructRenderMethodAsync

```typescript
constructRenderMethodAsync(template: string, renderMethodType: RenderMethodType, extra?: Record<string, unknown>): Promise<RenderMethod>
```

Asynchronous counterpart to `constructRenderMethod`. Behaves identically except that, for `RenderTemplate2024` outputs, it auto-fills `digestMultibase` from the source template bytes when a `url` is supplied and the caller has not already provided a digest.

`digestMultibase` is gated on the presence of `url`: it only adds value when the template is hosted remotely, since an inline `template` is already covered by the signed credential.

```typescript
import {
  constructRenderMethodAsync,
  RenderMethodType,
} from '@pyx-industries/vc-render-template-utils';

const renderMethod = await constructRenderMethodAsync(
  '<div>Hello, {{name}}!</div>',
  RenderMethodType.RenderTemplate2024,
  { url: 'https://example.com/template.html' },
);

// renderMethod.digestMultibase === 'z...' (sha2-256 + base58btc by default)
```

### generateDigestMultibase

```typescript
generateDigestMultibase(content: string, opts?: { algorithm?: HashAlgorithm; base?: MultibaseEncoding }): Promise<string>
```

Hashes the UTF-8 bytes of `content` and returns a multibase-encoded multihash string suitable for `digestMultibase` fields. Defaults to `sha2-256` and `base58btc`; see [@uncefact/untp-utils](https://www.npmjs.com/package/@uncefact/untp-utils) for the supported algorithms and encodings.

### extractRenderTemplate

```typescript
extractRenderTemplate(renderMethod: RenderMethod)
```

Extracts the template content, fetching from a URL if necessary.

- `renderMethod`: The render method object created by `constructRenderMethod`.

### populateTemplate

```typescript
populateTemplate(templatingEngineType: TemplatingEngineType, template: string, data: Record<string, unknown>)
```

Populates the template with data using the specified templating engine.

- `templatingEngineType`: Currently supports `Handlebars`.
- `template`: The template string to populate.
- `data`: The data object to populate the template.

## Supported Render Methods

- `RenderTemplate2024`: Supports remote and embedded templates.
- `WebRenderingTemplate2022`: Designed for embedded templates.

## Supported Templating Engines

- `Handlebars`: A robust templating engine for dynamic content.

## Development

### Prerequisites

- Node.js (v22, as specified in `.nvmrc`)
- yarn

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/pyx-industries/vc-render-template-utils.git
   cd vc-render-template-utils
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Build the project:

   ```bash
   yarn build
   ```

4. Run tests:

   ```bash
   yarn test
   ```

### Scripts

- `yarn build`: Compiles TypeScript to JavaScript.
- `yarn test`: Runs Jest tests.
- `yarn test:ci`: Runs tests with coverage.
- `yarn format`: Checks code formatting with Prettier.
- `yarn format:fix`: Auto-fixes formatting issues.
- `yarn lint`: Runs ESLint.
- `yarn lint:fix`: Auto-fixes linting issues.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request against `main`.

Ensure your code adheres to the project's linting and formatting standards by running `yarn lint` and `yarn format`. PRs that change user-visible behaviour should also update `CHANGELOG.md` and `RELEASE_NOTES.md` for the next version.

## Releasing

This repository uses trunk-based development on `main` with tag-triggered npm releases. See [ADR 001](./docs/adrs/001-trunk-based-development-and-tag-triggered-releases.md) for the rationale.

To cut a release:

1. Open a PR that bumps `package.json` to the target version and adds a corresponding entry to `CHANGELOG.md` and `RELEASE_NOTES.md`.
2. Merge the PR to `main`.
3. Push a tag matching the version, prefixed with `v`:

   ```bash
   git checkout main && git pull
   git tag v<X.Y.Z>
   git push origin v<X.Y.Z>
   ```

   Pre-release tags use the form `v<X.Y.Z>-rc.N`, `-alpha.N`, `-beta.N`, or `-pre.N` and publish under the `rc` npm dist-tag; everything else publishes under `latest`.

4. The `Release` workflow verifies that the tag's version matches `package.json`, runs lint + tests + build, and publishes to npm via OIDC Trusted Publishing.

If a release needs to be withdrawn, run the `npm rollback or archive` workflow from the Actions tab. Use `unpublish` within 72 hours of the original publish (npm policy); fall back to `deprecate` outside that window.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENCE) file for details.

## Issues

Report bugs or suggest features by opening an issue on the [GitHub Issues page](https://github.com/pyx-industries/vc-render-template-utils/issues).
