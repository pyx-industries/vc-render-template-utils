import { UnsupportedTemplatingEngineError } from '../errors';
import { TemplatingEngine, TemplatingEngineType } from '../types';
import { HandlebarsTemplatingEngine } from './handlebars';

export class TemplatingEngineFactory {
  createEngine(templatingEngine: TemplatingEngineType): TemplatingEngine {
    switch (templatingEngine) {
      case TemplatingEngineType.Handlebars:
        return new HandlebarsTemplatingEngine();
      default:
        throw new UnsupportedTemplatingEngineError(templatingEngine);
    }
  }
}
