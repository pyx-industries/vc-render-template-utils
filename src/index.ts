import { generateDigestMultibase } from './digest/multibase';
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
export {
  DEFAULT_DIGEST_ALGORITHM,
  DEFAULT_DIGEST_BASE,
  generateDigestMultibase,
  type GenerateDigestMultibaseOptions,
} from './digest/multibase';

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

/**
 * Asynchronous counterpart to {@link constructRenderMethod}. Behaves
 * identically except that, for `RenderTemplate2024` outputs, it auto-fills
 * `extra.digestMultibase` from the source `template` bytes when a `url` is
 * supplied and the caller has not already provided a digest. For all other
 * render method types and for cases without a `url`, the result matches the
 * synchronous constructor.
 *
 * Gating rationale: `digestMultibase` only adds value when the template is
 * hosted remotely. The signed credential covers an inline `template` by
 * itself, so emitting a digest there is at best redundant and at worst a
 * footgun if the inline content and the recorded digest drift. The presence
 * of `url` is treated as the caller's declaration of remote intent.
 *
 * Precondition for the URL-hosted case: the bytes the caller intends to host
 * at `url` must be byte-identical to the `template` argument passed here.
 * The digest is computed over the raw `template` bytes BEFORE whitespace
 * normalisation, so it describes the unprocessed input, not the cleaned
 * value that is also stored in the output's inline `template` field. If a
 * caller supplies both inline `template` and `url`, the stored inline value
 * will not hash to `digestMultibase`; a verifier must hash the bytes fetched
 * from `url`, not the inline `template` field. The intended workflow is to
 * host the unprocessed input at `url` and treat the inline `template` field
 * as either absent or a cache that is not the source of truth for the
 * digest.
 *
 * @param template Source template bytes. The digest, when generated, is
 *   computed from these bytes prior to whitespace normalisation, so it
 *   describes the content the caller intends to host at `url`.
 * @param renderMethodType Render method type to construct.
 * @param extra Optional metadata, forwarded to the synchronous constructor.
 *   For `RenderTemplate2024`, supported keys include `name`, `mediaQuery`,
 *   `url`, `mediaType`, and `digestMultibase`. A caller-supplied
 *   `digestMultibase` is preserved verbatim.
 * @returns The constructed render method object.
 * @throws If `renderMethodType` is not supported, or if the digest
 *   generation fails (see {@link generateDigestMultibase}).
 */
export async function constructRenderMethodAsync(
  template: string,
  renderMethodType: RenderMethodType,
  extra: Record<string, unknown> = {},
): Promise<RenderMethod> {
  const resolvedExtra = await resolveExtraWithDigest(
    template,
    renderMethodType,
    extra,
  );

  return constructRenderMethod(template, renderMethodType, resolvedExtra);
}

async function resolveExtraWithDigest(
  template: string,
  renderMethodType: RenderMethodType,
  extra: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (renderMethodType !== RenderMethodType.RenderTemplate2024) return extra;
  if (!template) return extra;
  if (!isNonEmptyString(extra.url)) return extra;
  if (isNonEmptyString(extra.digestMultibase)) return extra;

  const digestMultibase = await generateDigestMultibase(template);
  return { ...extra, digestMultibase };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
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
