import { RenderMethodType } from '../types';

export class UnsupportedRenderMethodError extends Error {
  constructor(method: RenderMethodType | string) {
    super(
      `Unsupported render method: ${method}. Supported methods are: ${Object.values(
        RenderMethodType,
      ).join(', ')}`,
    );
  }
}
