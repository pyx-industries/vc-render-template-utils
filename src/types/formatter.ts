export interface Formatter<T = Record<string, unknown>> {
  format(code: string, options?: T): string;
}

export interface BeautifyOptions {
  indent_size?: number;
}
