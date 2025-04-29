import { TemplatingEngineType } from '../types';

export class UnsupportedTemplatingEngineError extends Error {
  constructor(engine: TemplatingEngineType) {
    super(
      `Unsupported templating engine: ${engine}. Supported engines are: ${Object.values(
        TemplatingEngineType,
      ).join(', ')}`,
    );
  }
}
