import { UnsupportedRenderMethodError } from '../../errors';
import { DefaultFormatter } from '../../formatters';
import {
  RenderMethod2024,
  RenderMethodFactory,
  WebRenderingTemplate2022,
} from '../../render_methods';
import { Formatter, RenderMethodType } from '../../types';

jest.mock('../../render_methods/render-method-2024');
jest.mock('../../render_methods/web-rendering-template-2022');
jest.mock('../../formatters/default-formatter');

describe('RenderMethodFactory', () => {
  let factory: RenderMethodFactory;
  let mockFormatter: Formatter;

  beforeEach(() => {
    factory = new RenderMethodFactory();
    jest.clearAllMocks();

    mockFormatter = {
      format: jest.fn((code) => code),
    };
  });

  it('should create RenderMethod2024 instance with default formatter', () => {
    factory.createRenderMethod(RenderMethodType.RenderTemplate2024);

    expect(RenderMethod2024).toHaveBeenCalledTimes(1);
    expect(RenderMethod2024).toHaveBeenCalledWith(expect.any(DefaultFormatter));
  });

  it('should create WebRenderingTemplate2022 instance with default formatter', () => {
    factory.createRenderMethod(RenderMethodType.WebRenderingTemplate2022);

    expect(WebRenderingTemplate2022).toHaveBeenCalledTimes(1);
    expect(WebRenderingTemplate2022).toHaveBeenCalledWith(
      expect.any(DefaultFormatter),
    );
  });

  it('should create RenderMethod2024 instance with provided formatter', () => {
    factory.createRenderMethod(
      RenderMethodType.RenderTemplate2024,
      mockFormatter,
    );

    expect(RenderMethod2024).toHaveBeenCalledTimes(1);
    expect(RenderMethod2024).toHaveBeenCalledWith(mockFormatter);
  });

  it('should create WebRenderingTemplate2022 instance with provided formatter', () => {
    factory.createRenderMethod(
      RenderMethodType.WebRenderingTemplate2022,
      mockFormatter,
    );

    expect(WebRenderingTemplate2022).toHaveBeenCalledTimes(1);
    expect(WebRenderingTemplate2022).toHaveBeenCalledWith(mockFormatter);
  });

  it('should throw UnsupportedRenderMethodError for unknown types', () => {
    const unknownType = 'UnknownType' as RenderMethodType;

    expect(() => factory.createRenderMethod(unknownType)).toThrow(
      UnsupportedRenderMethodError,
    );
    expect(() => factory.createRenderMethod(unknownType)).toThrow(
      `Unsupported render method: ${unknownType}. Supported methods are: ${Object.values(
        RenderMethodType,
      ).join(', ')}`,
    );
  });
});
