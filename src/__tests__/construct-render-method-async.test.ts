import { MultibaseDigest } from '@uncefact/untp-utils';

import { constructRenderMethodAsync } from '../index';
import { RenderMethodType, RenderTemplate2024 } from '../types';

describe('constructRenderMethodAsync', () => {
  const template = '<div>{{name}}</div>';
  const url = 'https://example.com/template.html';

  describe('RenderTemplate2024', () => {
    it('auto-generates digestMultibase from the template bytes when url is set', async () => {
      const result = (await constructRenderMethodAsync(
        template,
        RenderMethodType.RenderTemplate2024,
        { url },
      )) as RenderTemplate2024;

      expect(result.digestMultibase).toBeDefined();
      const parsed = MultibaseDigest.fromString(result.digestMultibase!);
      await expect(
        parsed.verify(new TextEncoder().encode(template)),
      ).resolves.toBe(true);
    });

    it('omits digestMultibase when url is not set', async () => {
      const result = (await constructRenderMethodAsync(
        template,
        RenderMethodType.RenderTemplate2024,
        {},
      )) as RenderTemplate2024;

      expect(result.digestMultibase).toBeUndefined();
    });

    it('omits digestMultibase when url is an empty string', async () => {
      const result = (await constructRenderMethodAsync(
        template,
        RenderMethodType.RenderTemplate2024,
        { url: '' },
      )) as RenderTemplate2024;

      expect(result.digestMultibase).toBeUndefined();
    });

    it('omits digestMultibase when url is a non-string value', async () => {
      const result = (await constructRenderMethodAsync(
        template,
        RenderMethodType.RenderTemplate2024,
        { url: 123 as unknown as string },
      )) as RenderTemplate2024;

      expect(result.digestMultibase).toBeUndefined();
    });

    it('regenerates digestMultibase when caller supplies an empty string', async () => {
      const result = (await constructRenderMethodAsync(
        template,
        RenderMethodType.RenderTemplate2024,
        { url, digestMultibase: '' },
      )) as RenderTemplate2024;

      expect(result.digestMultibase).toBeDefined();
      expect(result.digestMultibase).not.toBe('');
    });

    it('omits digestMultibase when template is empty even if url is set', async () => {
      const result = (await constructRenderMethodAsync(
        '',
        RenderMethodType.RenderTemplate2024,
        { url },
      )) as RenderTemplate2024;

      expect(result.digestMultibase).toBeUndefined();
    });

    it('preserves a caller-supplied digestMultibase rather than overwriting it', async () => {
      const callerSupplied = 'zCallerSuppliedValue';

      const result = (await constructRenderMethodAsync(
        template,
        RenderMethodType.RenderTemplate2024,
        { url, digestMultibase: callerSupplied },
      )) as RenderTemplate2024;

      expect(result.digestMultibase).toBe(callerSupplied);
    });

    it('still passes through the cleaned template, mediaQuery, and url', async () => {
      const result = (await constructRenderMethodAsync(
        '<div>\n   {{name}}   </div>',
        RenderMethodType.RenderTemplate2024,
        { url, mediaQuery: 'print' },
      )) as RenderTemplate2024;

      expect(result.type).toEqual([RenderMethodType.RenderTemplate2024]);
      expect(result.template).toBe('<div> {{name}} </div>');
      expect(result.url).toBe(url);
      expect(result.mediaQuery).toBe('print');
    });
  });

  describe('WebRenderingTemplate2022', () => {
    it('returns a result identical to the sync constructRenderMethod', async () => {
      const result = await constructRenderMethodAsync(
        template,
        RenderMethodType.WebRenderingTemplate2022,
      );

      expect(result).toEqual({
        type: RenderMethodType.WebRenderingTemplate2022,
        template,
      });
    });
  });
});
