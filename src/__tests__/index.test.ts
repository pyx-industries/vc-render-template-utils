import {
  constructRenderMethod,
  extractRenderTemplate,
  populateTemplate,
} from '../index';
import { RenderMethodFactory } from '../render_methods';
import { TemplatingEngineFactory } from '../templating_engines';
import {
  RenderMethod,
  RenderMethodProvider,
  RenderMethodType,
  TemplatingEngine,
  TemplatingEngineType,
} from '../types';
import * as utils from '../utils';

jest.mock('../render_methods/factory');
jest.mock('../templating_engines/factory');
jest.mock('../utils');

const MockedRenderMethodFactory = RenderMethodFactory as jest.MockedClass<
  typeof RenderMethodFactory
>;
const MockedTemplatingEngineFactory =
  TemplatingEngineFactory as jest.MockedClass<typeof TemplatingEngineFactory>;
const mockedUtils = utils as jest.Mocked<typeof utils>;

describe('Main Index Functions', () => {
  let mockRenderMethodProvider: jest.Mocked<RenderMethodProvider>;
  let mockTemplatingEngine: jest.Mocked<TemplatingEngine>;

  beforeEach(() => {
    MockedRenderMethodFactory.mockClear();
    MockedTemplatingEngineFactory.mockClear();
    mockedUtils.removeLineBreaks.mockClear();

    mockRenderMethodProvider = {
      construct: jest.fn(),
      extractTemplate: jest.fn(),
    };
    mockTemplatingEngine = {
      populate: jest.fn(),
    };

    MockedRenderMethodFactory.prototype.createRenderMethod = jest
      .fn()
      .mockReturnValue(mockRenderMethodProvider);
    MockedTemplatingEngineFactory.prototype.createEngine = jest
      .fn()
      .mockReturnValue(mockTemplatingEngine);
  });

  describe('constructRenderMethod', () => {
    const template = 'template\nwith\nbreaks';
    const cleanedTemplate = 'templatewithbreaks';
    const type = RenderMethodType.RenderTemplate2024;
    const extra = { key: 'value' };
    const expectedResult: RenderMethod = {
      type: RenderMethodType.RenderTemplate2024,
      template: cleanedTemplate,
      mediaQuery: '',
      url: '',
    };

    it('should call removeLineBreaks with the template', () => {
      mockedUtils.removeLineBreaks.mockReturnValue(cleanedTemplate);
      mockRenderMethodProvider.construct.mockReturnValue(expectedResult);

      constructRenderMethod(template, type, extra);
      expect(mockedUtils.removeLineBreaks).toHaveBeenCalledWith(template);
    });

    it('should create RenderMethodFactory and call createRenderMethod', () => {
      mockedUtils.removeLineBreaks.mockReturnValue(cleanedTemplate);
      mockRenderMethodProvider.construct.mockReturnValue(expectedResult);

      constructRenderMethod(template, type, extra);
      expect(MockedRenderMethodFactory).toHaveBeenCalledTimes(1);
      expect(
        MockedRenderMethodFactory.prototype.createRenderMethod,
      ).toHaveBeenCalledWith(type);
    });

    it('should call construct on the created render method provider', () => {
      mockedUtils.removeLineBreaks.mockReturnValue(cleanedTemplate);
      mockRenderMethodProvider.construct.mockReturnValue(expectedResult);

      constructRenderMethod(template, type, extra);
      expect(mockRenderMethodProvider.construct).toHaveBeenCalledWith(
        cleanedTemplate,
        extra,
      );
    });

    it('should return the result from the render method provider construct', () => {
      mockedUtils.removeLineBreaks.mockReturnValue(cleanedTemplate);
      mockRenderMethodProvider.construct.mockReturnValue(expectedResult);

      const result = constructRenderMethod(template, type, extra);
      expect(result).toBe(expectedResult);
    });
  });

  describe('extractRenderTemplate', () => {
    const renderMethodObject: RenderMethod = {
      type: RenderMethodType.RenderTemplate2024,
      template: 'some template',
    };
    const expectedTemplate = 'extracted template content';

    it('should create RenderMethodFactory and call createRenderMethod', async () => {
      mockRenderMethodProvider.extractTemplate.mockResolvedValue(
        expectedTemplate,
      );

      await extractRenderTemplate(renderMethodObject);
      expect(MockedRenderMethodFactory).toHaveBeenCalledTimes(1);
      expect(
        MockedRenderMethodFactory.prototype.createRenderMethod,
      ).toHaveBeenCalledWith(renderMethodObject.type);
    });

    it('should call extractTemplate on the created render method provider', async () => {
      mockRenderMethodProvider.extractTemplate.mockResolvedValue(
        expectedTemplate,
      );

      await extractRenderTemplate(renderMethodObject);
      expect(mockRenderMethodProvider.extractTemplate).toHaveBeenCalledWith(
        renderMethodObject,
      );
    });

    it('should return the result from the render method provider extractTemplate', async () => {
      mockRenderMethodProvider.extractTemplate.mockResolvedValue(
        expectedTemplate,
      );

      const result = await extractRenderTemplate(renderMethodObject);
      expect(result).toBe(expectedTemplate);
    });
  });

  describe('populateTemplate', () => {
    const engineType = TemplatingEngineType.Handlebars;
    const template = 'Hello, {{name}}';
    const data = { name: 'Test' };
    const expectedPopulatedTemplate = 'Hello, Test';

    it('should create TemplatingEngineFactory and call createEngine', () => {
      mockTemplatingEngine.populate.mockReturnValue(expectedPopulatedTemplate);

      populateTemplate(engineType, template, data);
      expect(MockedTemplatingEngineFactory).toHaveBeenCalledTimes(1);
      expect(
        MockedTemplatingEngineFactory.prototype.createEngine,
      ).toHaveBeenCalledWith(engineType);
    });

    it('should call populate on the created templating engine', () => {
      mockTemplatingEngine.populate.mockReturnValue(expectedPopulatedTemplate);

      populateTemplate(engineType, template, data);
      expect(mockTemplatingEngine.populate).toHaveBeenCalledWith(
        template,
        data,
      );
    });

    it('should return the result from the templating engine populate', () => {
      mockTemplatingEngine.populate.mockReturnValue(expectedPopulatedTemplate);

      const result = populateTemplate(engineType, template, data);
      expect(result).toBe(expectedPopulatedTemplate);
    });
  });
});
