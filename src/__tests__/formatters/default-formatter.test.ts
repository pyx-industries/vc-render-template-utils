import beautify from 'js-beautify';
import { DefaultFormatter } from '../../formatters';
import { BeautifyOptions } from '../../types';

jest.mock('js-beautify');

const mockedBeautify = beautify as jest.Mocked<typeof beautify>;

describe('DefaultFormatter', () => {
  let formatter: DefaultFormatter;

  beforeEach(() => {
    jest.clearAllMocks();

    formatter = new DefaultFormatter();
  });

  it('should call beautify.html with default options when none are provided', () => {
    const rawCode = '<div><span>test</span></div>';
    const expectedOptions = { indent_size: 2 };
    const expectedFormattedCode = 'formatted_code_default';

    mockedBeautify.html.mockReturnValue(expectedFormattedCode);

    const result = formatter.format(rawCode);

    expect(mockedBeautify.html).toHaveBeenCalledTimes(1);
    expect(mockedBeautify.html).toHaveBeenCalledWith(rawCode, expectedOptions);
    expect(result).toBe(expectedFormattedCode);
  });

  it('should call beautify.html merging provided options with defaults', () => {
    const rawCode = '<p>another test</p>';
    const providedOptions: BeautifyOptions = { indent_size: 4 };
    const expectedOptions = { indent_size: 4 };
    const expectedFormattedCode = 'formatted_code_custom';

    mockedBeautify.html.mockReturnValue(expectedFormattedCode);

    const result = formatter.format(rawCode, providedOptions);

    expect(mockedBeautify.html).toHaveBeenCalledTimes(1);
    expect(mockedBeautify.html).toHaveBeenCalledWith(rawCode, expectedOptions);
    expect(result).toBe(expectedFormattedCode);
  });

  it('should use default indent_size if other options are provided', () => {
    const rawCode = '<ul><li>item</li></ul>';
    const providedOptions = {} as BeautifyOptions;
    const expectedOptions = { indent_size: 2 };
    const expectedFormattedCode = 'formatted_code_other_options';

    mockedBeautify.html.mockReturnValue(expectedFormattedCode);

    const result = formatter.format(rawCode, providedOptions);

    expect(mockedBeautify.html).toHaveBeenCalledTimes(1);
    expect(mockedBeautify.html).toHaveBeenCalledWith(rawCode, expectedOptions);
    expect(result).toBe(expectedFormattedCode);
  });
});
