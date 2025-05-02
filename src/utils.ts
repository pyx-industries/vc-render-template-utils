import { TemplateFetchError } from './errors';

export const fetchTemplate = async (url: string) => {
  try {
    const response = await fetch(url);
    const templateText = await response.text();
    return templateText;
  } catch {
    throw new TemplateFetchError(url);
  }
};

export const removeLineBreaks = (str: string) => {
  return str.replace(/\n/g, '');
};

export const normaliseWhitespace = (str: string) => {
  return str.replace(/\s+/g, ' ');
};
