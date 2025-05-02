import { TemplateFetchError } from '../errors';
import { fetchTemplate, normaliseWhitespace, removeLineBreaks } from '../utils';

describe('Utility Functions', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('fetchTemplate', () => {
    const testUrl = 'http://example.com/template.html';

    it('should fetch and return template text on success', async () => {
      const mockTemplateText = '<div>Test Template</div>';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValueOnce(mockTemplateText),
      });

      const template = await fetchTemplate(testUrl);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(testUrl);
      expect(template).toBe(mockTemplateText);
    });

    it('should throw TemplateFetchError if fetch fails', async () => {
      const fetchError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(fetchTemplate(testUrl)).rejects.toThrow(TemplateFetchError);
      await expect(fetchTemplate(testUrl)).rejects.toThrow(
        `Failed to fetch template from url: ${testUrl}`,
      );

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(testUrl);
    });

    it('should throw TemplateFetchError if response.text() promise rejects', async () => {
      const textError = new Error('Failed to read text');
      const mockBadResponse = {
        ok: true,
        text: jest.fn().mockRejectedValue(textError),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockBadResponse);

      await expect(fetchTemplate(testUrl)).rejects.toBeInstanceOf(
        TemplateFetchError,
      );

      // Reset mock and set it up again for the second assertion
      (global.fetch as jest.Mock).mockClear();
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockBadResponse);

      await expect(fetchTemplate(testUrl)).rejects.toThrow(
        `Failed to fetch template from url: ${testUrl}`,
      );

      expect(global.fetch).toHaveBeenCalledWith(testUrl);
      expect(mockBadResponse.text).toHaveBeenCalledTimes(2);
    });
  });

  describe('removeLineBreaks', () => {
    it('should remove single line breaks', () => {
      expect(removeLineBreaks('hello\nworld')).toBe('helloworld');
    });

    it('should remove multiple line breaks', () => {
      expect(removeLineBreaks('line1\nline2\nline3')).toBe('line1line2line3');
    });

    it('should return the same string if no line breaks exist', () => {
      expect(removeLineBreaks('no line breaks')).toBe('no line breaks');
    });

    it('should handle empty string', () => {
      expect(removeLineBreaks('')).toBe('');
    });

    it('should handle string with only line breaks', () => {
      expect(removeLineBreaks('\n\n\n')).toBe('');
    });

    it('should handle mixed content', () => {
      expect(removeLineBreaks('start\nmiddle\nend')).toBe('startmiddleend');
    });

    it('should remove carriage returns', () => {
      expect(removeLineBreaks('hello\rworld')).toBe('helloworld');
    });

    it('should remove Windows-style line endings (CRLF)', () => {
      expect(removeLineBreaks('hello\r\nworld')).toBe('helloworld');
    });

    it('should remove multiple consecutive mixed line breaks', () => {
      expect(removeLineBreaks('hello\n\n\rworld\r\n\r\nmiddle')).toBe(
        'helloworldmiddle',
      );
    });

    it('should treat consecutive line breaks as a single replacement', () => {
      expect(removeLineBreaks('line\n\n\nbreak')).toBe('linebreak');
      expect(removeLineBreaks('line\r\r\rbreak')).toBe('linebreak');
      expect(removeLineBreaks('line\r\n\r\nbreak')).toBe('linebreak');
    });
  });

  describe('normaliseWhitespace', () => {
    it('should replace multiple spaces with a single space', () => {
      expect(normaliseWhitespace('hello    world')).toBe('hello world');
    });

    it('should replace tabs with a single space', () => {
      expect(normaliseWhitespace('hello\tworld')).toBe('hello world');
    });

    it('should replace mixed whitespace with a single space', () => {
      expect(normaliseWhitespace('hello \t \n world')).toBe('hello world');
    });

    it('should handle leading and trailing whitespace', () => {
      expect(normaliseWhitespace('  hello world  ')).toBe(' hello world ');
    });

    it('should handle empty string', () => {
      expect(normaliseWhitespace('')).toBe('');
    });

    it('should handle string with only whitespace', () => {
      expect(normaliseWhitespace('   \t\n   ')).toBe(' ');
    });
  });
});
