import { RenderMethodType } from '../types';

export class UnsupportedRenderMethodError extends Error {
  constructor(method: RenderMethodType) {
    super(
      `Unsupported render method: ${method}. Supported methods are: ${Object.values(
        RenderMethodType,
      ).join(', ')}`,
    );
  }
}
