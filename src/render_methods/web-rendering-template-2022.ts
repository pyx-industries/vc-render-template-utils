import { TemplateNotFoundError } from '../errors';
import {
  Formatter,
  RenderMethod,
  RenderMethodProvider,
  RenderMethodType,
  WebRenderingTemplate2022 as WebRenderingTemplate2022Type,
} from '../types';

export const defaultRenderMethod2022: WebRenderingTemplate2022Type = {
  type: RenderMethodType.WebRenderingTemplate2022,
  template: '',
};

export class WebRenderingTemplate2022 implements RenderMethodProvider {
  private readonly _formatter: Formatter;

  constructor(formatter: Formatter) {
    this._formatter = formatter;
  }

  construct(
    template: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extra: Record<string, unknown>,
  ): WebRenderingTemplate2022Type {
    return {
      type: RenderMethodType.WebRenderingTemplate2022,
      template,
    };
  }

  async extractTemplate(renderMethod: RenderMethod): Promise<string> {
    const template = await this.getTemplate(
      renderMethod as WebRenderingTemplate2022Type,
    );
    return this._formatter.format(template);
  }

  private async getTemplate(
    renderMethod: WebRenderingTemplate2022Type,
  ): Promise<string> {
    let template = renderMethod.template;

    if (template) {
      return template;
    }

    throw new TemplateNotFoundError(renderMethod.template);
  }
}
