import { TemplateFetchError, TemplateNotFoundError } from '../errors';
import {
  Formatter,
  RenderMethod,
  RenderMethodProvider,
  RenderMethodType,
  RenderTemplate2024,
} from '../types';
import { fetchTemplate } from '../utils';

export const defaultRenderMethod2024: RenderTemplate2024 = {
  type: [RenderMethodType.RenderTemplate2024],
};

const OPTIONAL_FIELDS = [
  'name',
  'mediaQuery',
  'url',
  'mediaType',
  'digestMultibase',
] as const;

export class RenderMethod2024 implements RenderMethodProvider {
  private readonly _formatter: Formatter;

  constructor(formatter: Formatter) {
    this._formatter = formatter;
  }

  construct(
    template: string,
    extra: Record<string, unknown>,
  ): RenderTemplate2024 {
    const result: RenderTemplate2024 = {
      type: [RenderMethodType.RenderTemplate2024],
    };

    if (template) {
      result.template = template;
    }

    for (const field of OPTIONAL_FIELDS) {
      const value = extra[field];
      if (typeof value === 'string' && value !== '') {
        result[field] = value;
      }
    }

    return result;
  }

  async extractTemplate(renderMethod: RenderMethod): Promise<string> {
    const template = await this.getTemplate(renderMethod as RenderTemplate2024);

    return this._formatter.format(template);
  }

  private async getTemplate(renderMethod: RenderTemplate2024): Promise<string> {
    let template = renderMethod.template;

    if (template) {
      return template;
    }

    if (renderMethod.url) {
      template = await fetchTemplate(renderMethod.url);
      if (!template) {
        throw new TemplateFetchError(renderMethod.url);
      }
      return template;
    }

    throw new TemplateNotFoundError(renderMethod.template, renderMethod.url);
  }
}
