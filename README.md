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
- `extra`: Optional metadata (e.g., `url` or `mediaQuery`).

### extractRenderTemplate

```typescript
`extractRenderTemplate(renderMethod: RenderMethod)
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
5. Open a pull request.

Ensure your code adheres to the project's linting and formatting standards by running `yarn lint` and `yarn format`.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENCE) file for details.

## Issues

Report bugs or suggest features by opening an issue on the [GitHub Issues page](https://github.com/pyx-industries/vc-render-template-utils/issues).
