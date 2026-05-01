import { UnsupportedRenderMethodError } from './errors';
import { RenderMethodFactory } from './render_methods/factory';
import { TemplatingEngineFactory } from './templating_engines/factory';
import {
  RenderMethod,
  RenderMethodType,
  TemplatingEngineType,
  supportedRenderMethods,
} from './types';
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
  const renderMethodType = resolveRenderMethodType(renderMethodObject.type);

  const renderMethodFactory = new RenderMethodFactory();
  const renderMethod = renderMethodFactory.createRenderMethod(renderMethodType);

  const renderTemplate = await renderMethod.extractTemplate(renderMethodObject);

  return renderTemplate;
};

const resolveRenderMethodType = (
  type: RenderMethod['type'],
): RenderMethodType => {
  if (!Array.isArray(type)) {
    return type;
  }

  const match = type.find((entry): entry is RenderMethodType =>
    (supportedRenderMethods as readonly string[]).includes(entry),
  );

  if (!match) {
    throw new UnsupportedRenderMethodError(
      type.length === 0 ? '<empty>' : type.join(', '),
    );
  }

  return match;
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
