import { RenderMethodFactory } from './render_methods/factory';
import { TemplatingEngineFactory } from './templating_engines/factory';
import { RenderMethod, RenderMethodType, TemplatingEngineType } from './types';
import { normaliseWhitespace, removeLineBreaks } from './utils';

export * from './errors';
export * from './types';

export function constructRenderMethod(
  template: string,
  renderMethodType: RenderMethodType,
  extra: Record<string, unknown> = {},
): RenderMethod {
  const cleanedTemplate = normaliseWhitespace(removeLineBreaks(template));

  const renderMethodFactory = new RenderMethodFactory();
  const renderMethod = renderMethodFactory.createRenderMethod(renderMethodType);

  return renderMethod.construct(cleanedTemplate, extra);
}

export const extractRenderTemplate = async (
  renderMethodObject: RenderMethod,
): Promise<string> => {
  const renderMethodType = renderMethodObject.type;

  const renderMethodFactory = new RenderMethodFactory();
  const renderMethod = renderMethodFactory.createRenderMethod(renderMethodType);

  const renderTemplate = await renderMethod.extractTemplate(renderMethodObject);

  return renderTemplate;
};

export const populateTemplate = (
  templatingEngineType: TemplatingEngineType,
  renderTemplate: string,
  data: Record<string, unknown>,
): string => {
  const templatingEngineFactory = new TemplatingEngineFactory();
  const templatingEngine =
    templatingEngineFactory.createEngine(templatingEngineType);

  const populatedTemplate = templatingEngine.populate(renderTemplate, data);

  return populatedTemplate;
};
