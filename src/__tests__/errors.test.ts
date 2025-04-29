import {
  TemplateFetchError,
  TemplateNotFoundError,
  UnsupportedRenderMethodError,
  UnsupportedTemplatingEngineError,
} from '../errors';
import { RenderMethodType, TemplatingEngineType } from '../types';

describe('Custom Error Classes', () => {
  describe('UnsupportedTemplatingEngineError', () => {
    it('should create an error with the correct message', () => {
      const engineType = 'UnknownEngine' as TemplatingEngineType;
      const error = new UnsupportedTemplatingEngineError(engineType);
      const expectedEngines = Object.values(TemplatingEngineType).join(', ');
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Unsupported templating engine: ${engineType}. Supported engines are: ${expectedEngines}`,
      );
    });
  });

  describe('UnsupportedRenderMethodError', () => {
    it('should create an error with the correct message', () => {
      const methodType = 'UnknownMethod' as RenderMethodType;
      const error = new UnsupportedRenderMethodError(methodType);
      const expectedMethods = Object.values(RenderMethodType).join(', ');
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Unsupported render method: ${methodType}. Supported methods are: ${expectedMethods}`,
      );
    });
  });

  describe('TemplateFetchError', () => {
    it('should create an error with the correct message including the URL', () => {
      const url = 'http://example.com/template.txt';
      const error = new TemplateFetchError(url);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('TemplateFetchError');
      expect(error.message).toBe(`Failed to fetch template from url: ${url}`);
    });
  });

  describe('TemplateNotFoundError', () => {
    it('should create an error with the template-only message', () => {
      const template = 'some_template_string';
      const error = new TemplateNotFoundError(template);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Template not found. Expected value in template or url but received "${template}".`,
      );
    });

    it('should create an error with the url-only message', () => {
      const url = 'http://example.com/template';
      const error = new TemplateNotFoundError(undefined, url);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Template not found. Expected value in template or url but received "${url}".`,
      );
    });

    it('should create an error with the template-and-url message', () => {
      const template = 'some_template';
      const url = 'http://example.com/template';
      const error = new TemplateNotFoundError(template, url);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Template not found. Expected value in template or url but received "${template}" and "${url}".`,
      );
    });

    it('should create an error with undefined message parts', () => {
      const error = new TemplateNotFoundError(undefined, undefined);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Template not found. Expected value in template or url but received "undefined".`,
      );
    });
  });
});
