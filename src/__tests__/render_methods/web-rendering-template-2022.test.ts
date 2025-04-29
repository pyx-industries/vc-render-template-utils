import { TemplateNotFoundError } from '../../errors';
import {
  WebRenderingTemplate2022,
  defaultRenderMethod2022,
} from '../../render_methods';
import {
  Formatter,
  RenderMethodType,
  WebRenderingTemplate2022 as WebRenderingTemplate2022Type,
} from '../../types';

describe('WebRenderingTemplate2022', () => {
  let renderMethod: WebRenderingTemplate2022;
  let mockFormatter: jest.Mocked<Formatter>;
  const templateContent = '<iframe src="{{url}}"></iframe>';

  beforeEach(() => {
    mockFormatter = {
      format: jest.fn((code) => code),
    };
    renderMethod = new WebRenderingTemplate2022(mockFormatter);
  });

  describe('construct', () => {
    it('should construct a WebRenderingTemplate2022 object correctly', () => {
      const result = renderMethod.construct(templateContent, {});
      expect(result).toEqual({
        type: RenderMethodType.WebRenderingTemplate2022,
        template: templateContent,
      });
    });
  });

  describe('extractTemplate', () => {
    it('should return the template if provided and call formatter', async () => {
      const methodObject: WebRenderingTemplate2022Type = {
        ...defaultRenderMethod2022,
        template: templateContent,
      };
      const extracted = await renderMethod.extractTemplate(methodObject);

      expect(mockFormatter.format).toHaveBeenCalledTimes(1);
      expect(mockFormatter.format).toHaveBeenCalledWith(templateContent);
      expect(extracted).toBe(templateContent);
    });

    it('should throw TemplateNotFoundError if template is missing and not call formatter', async () => {
      const methodObject: WebRenderingTemplate2022Type = {
        ...defaultRenderMethod2022,
        template: '',
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
      const rawTemplate = '<html><body><iframe></iframe></body></html>';
      const mockFormattedTemplate = 'formatted_html';
      mockFormatter.format.mockReturnValue(mockFormattedTemplate);

      const methodObject: WebRenderingTemplate2022Type = {
        ...defaultRenderMethod2022,
        template: rawTemplate,
      };
      const extracted = await renderMethod.extractTemplate(methodObject);

      expect(mockFormatter.format).toHaveBeenCalledTimes(1);
      expect(mockFormatter.format).toHaveBeenCalledWith(rawTemplate);
      expect(extracted).toBe(mockFormattedTemplate);
    });
  });
});
