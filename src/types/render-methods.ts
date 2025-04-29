export enum RenderMethodType {
  RenderTemplate2024 = 'RenderTemplate2024',
  WebRenderingTemplate2022 = 'WebRenderingTemplate2022',
}

export const supportedRenderMethods = [
  RenderMethodType.RenderTemplate2024,
  RenderMethodType.WebRenderingTemplate2022,
] as const;

export interface RenderTemplate2024 {
  type: RenderMethodType.RenderTemplate2024;
  mediaQuery?: string;
  template?: string;
  url?: string;
}

export interface WebRenderingTemplate2022 {
  type: RenderMethodType.WebRenderingTemplate2022;
  template: string;
}

export type RenderMethod = RenderTemplate2024 | WebRenderingTemplate2022;

export interface RenderMethodProvider {
  construct: (template: string, extra: Record<string, unknown>) => RenderMethod;
  extractTemplate: (renderMethod: RenderMethod) => Promise<string>;
}
