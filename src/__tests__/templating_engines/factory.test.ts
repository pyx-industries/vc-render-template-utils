import { UnsupportedTemplatingEngineError } from '../../errors';
import {
  HandlebarsTemplatingEngine,
  TemplatingEngineFactory,
} from '../../templating_engines';
import { TemplatingEngineType } from '../../types';

describe('TemplatingEngineFactory', () => {
  let factory: TemplatingEngineFactory;

  beforeEach(() => {
    factory = new TemplatingEngineFactory();
  });

  it('should create HandlebarsTemplatingEngine instance', () => {
    const engine = factory.createEngine(TemplatingEngineType.Handlebars);
    expect(engine).toBeInstanceOf(HandlebarsTemplatingEngine);
  });

  it('should throw UnsupportedTemplatingEngineError for unknown types', () => {
    const unknownType = 'UnknownEngine' as TemplatingEngineType;
    expect(() => factory.createEngine(unknownType)).toThrow(
      UnsupportedTemplatingEngineError,
    );
    expect(() => factory.createEngine(unknownType)).toThrow(
      `Unsupported templating engine: ${unknownType}. Supported engines are: ${Object.values(
        TemplatingEngineType,
      ).join(', ')}`,
    );
  });
});
