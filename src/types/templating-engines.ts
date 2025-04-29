export enum TemplatingEngineType {
  Handlebars = 'handlebars',
}

export const supportedTemplatingEngines = [
  TemplatingEngineType.Handlebars,
] as const;

export interface TemplatingEngine {
  populate(template: string, data: Record<string, unknown>): string;
}
