import { UnsupportedRenderMethodError } from '../errors';
import { DefaultFormatter } from '../formatters/default-formatter';
import { Formatter, RenderMethodProvider, RenderMethodType } from '../types';
import { RenderMethod2024 } from './render-method-2024';
import { WebRenderingTemplate2022 } from './web-rendering-template-2022';

export class RenderMethodFactory {
  createRenderMethod(
    type: RenderMethodType,
    formatter: Formatter = new DefaultFormatter(),
  ): RenderMethodProvider {
    switch (type) {
      case RenderMethodType.RenderTemplate2024:
        return new RenderMethod2024(formatter);
      case RenderMethodType.WebRenderingTemplate2022:
        return new WebRenderingTemplate2022(formatter);
      default:
        throw new UnsupportedRenderMethodError(type);
    }
  }
}
