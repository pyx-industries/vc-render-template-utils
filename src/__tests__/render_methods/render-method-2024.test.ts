import { TemplateFetchError, TemplateNotFoundError } from '../../errors';
import {
  RenderMethod2024,
  defaultRenderMethod2024,
} from '../../render_methods';
import { Formatter, RenderMethodType, RenderTemplate2024 } from '../../types';
import * as utils from '../../utils';

jest.mock('../../utils');

const mockedUtils = utils as jest.Mocked<typeof utils>;

describe('RenderMethod2024', () => {
  let renderMethod: RenderMethod2024;
  let mockFormatter: jest.Mocked<Formatter>;
  const templateContent = '<div>{{name}}</div>';
  const extraData = { mediaQuery: 'print', url: 'http://example.com/t.html' };

  beforeEach(() => {
    mockFormatter = {
      format: jest.fn((code) => code),
    };
    renderMethod = new RenderMethod2024(mockFormatter);
    mockedUtils.fetchTemplate.mockClear();
  });

  describe('construct', () => {
    it('should construct a RenderTemplate2024 object correctly', () => {
      const result = renderMethod.construct(templateContent, extraData);
      expect(result).toEqual({
        type: RenderMethodType.RenderTemplate2024,
        template: templateContent,
        mediaQuery: extraData.mediaQuery,
        url: extraData.url,
      });
    });

    it('should use default values if extra data is missing', () => {
      const result = renderMethod.construct(templateContent, {});
      expect(result).toEqual({
        type: RenderMethodType.RenderTemplate2024,
        template: templateContent,
        mediaQuery: '',
        url: '',
      });
    });
  });

  describe('extractTemplate', () => {
    it('should return the template if provided directly and call formatter', async () => {
      const methodObject: RenderTemplate2024 = {
        ...defaultRenderMethod2024,
        template: templateContent,
      };
      const extracted = await renderMethod.extractTemplate(methodObject);

      expect(mockFormatter.format).toHaveBeenCalledTimes(1);
      expect(mockFormatter.format).toHaveBeenCalledWith(templateContent);
      expect(extracted).toBe(templateContent);
    });

    it('should fetch the template from the URL and call formatter', async () => {
      const methodObject: RenderTemplate2024 = {
        ...defaultRenderMethod2024,
        url: extraData.url,
      };
      const fetchedTemplate = '<p>Fetched Template {{value}}</p>';
      mockedUtils.fetchTemplate.mockResolvedValue(fetchedTemplate);

      const extracted = await renderMethod.extractTemplate(methodObject);
      expect(mockedUtils.fetchTemplate).toHaveBeenCalledWith(extraData.url);

      expect(mockFormatter.format).toHaveBeenCalledTimes(1);
      expect(mockFormatter.format).toHaveBeenCalledWith(fetchedTemplate);
      expect(extracted).toBe(fetchedTemplate);
    });

    it('should throw TemplateFetchError if URL fetch fails and not call formatter', async () => {
      const methodObject: RenderTemplate2024 = {
        ...defaultRenderMethod2024,
        url: extraData.url,
      };
      mockedUtils.fetchTemplate.mockResolvedValue(undefined as any);

      await expect(renderMethod.extractTemplate(methodObject)).rejects.toThrow(
        TemplateFetchError,
      );
      await expect(renderMethod.extractTemplate(methodObject)).rejects.toThrow(
        `Failed to fetch template from url: ${extraData.url}`,
      );
      expect(mockedUtils.fetchTemplate).toHaveBeenCalledWith(extraData.url);
      expect(mockFormatter.format).not.toHaveBeenCalled();
    });

    it('should throw TemplateNotFoundError if neither template nor URL is provided and not call formatter', async () => {
      const methodObject: RenderTemplate2024 = {
        ...defaultRenderMethod2024,
        template: '',
        url: '',
      };

      await expect(renderMethod.extractTemplate(methodObject)).rejects.toThrow(
        TemplateNotFoundError,
      );
      await expect(renderMethod.extractTemplate(methodObject)).rejects.toThrow(
        `Template not found. Expected value in template or url but received "".`,
      );
      expect(mockFormatter.format).not.toHaveBeenCalled();
    });

    it('should call formatter with the raw template', async () => {
      const rawTemplate = '<html><body><div><p>Test</p></div></body></html>';
      const mockFormattedTemplate = 'formatted_html_2024';
      mockFormatter.format.mockReturnValue(mockFormattedTemplate);

      const methodObject: RenderTemplate2024 = {
        ...defaultRenderMethod2024,
        template: rawTemplate,
      };
      const extracted = await renderMethod.extractTemplate(methodObject);

      expect(mockFormatter.format).toHaveBeenCalledTimes(1);
      expect(mockFormatter.format).toHaveBeenCalledWith(rawTemplate);
      expect(extracted).toBe(mockFormattedTemplate);
    });
  });
});
