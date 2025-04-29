import * as Handlebars from 'handlebars';
import { TemplatingEngine } from '../types';

export class HandlebarsTemplatingEngine implements TemplatingEngine {
  populate(template: string, data: Record<string, unknown>): string {
    const compiledTemplate = Handlebars.compile(template);
    const populatedTemplate = compiledTemplate(data);

    return populatedTemplate;
  }
}
