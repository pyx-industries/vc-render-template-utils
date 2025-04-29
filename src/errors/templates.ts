export class TemplateFetchError extends Error {
  constructor(url: string) {
    super(`Failed to fetch template from url: ${url}`);
    this.name = 'TemplateFetchError';
  }
}

export class TemplateNotFoundError extends Error {
  constructor(template: string | undefined, url?: string) {
    const templateOnlyErrorMessage = `Template not found. Expected value in template or url but received "${
      template ?? 'undefined'
    }".`;
    const urlOnlyErrorMessage = `Template not found. Expected value in template or url but received "${
      url ?? 'undefined'
    }".`;
    const templateAndUrlErrorMessage = `Template not found. Expected value in template or url but received "${
      template ?? 'undefined'
    }" and "${url ?? 'undefined'}".`;

    super(
      url
        ? template
          ? templateAndUrlErrorMessage
          : urlOnlyErrorMessage
        : templateOnlyErrorMessage,
    );
  }
}
