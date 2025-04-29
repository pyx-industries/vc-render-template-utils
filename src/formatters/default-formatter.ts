import beautify from 'js-beautify';
import { BeautifyOptions, Formatter } from '../types';

const DEFAULT_OPTIONS: BeautifyOptions = {
  indent_size: 2,
};

export class DefaultFormatter implements Formatter<BeautifyOptions> {
  format(code: string, options: BeautifyOptions = DEFAULT_OPTIONS): string {
    const formatOptions = { ...DEFAULT_OPTIONS, ...options };
    return beautify.html(code, formatOptions);
  }
}
