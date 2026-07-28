import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from '../../src/utils/sanitize';

describe('sanitizeHtml', () => {
  describe('clean HTML should pass through', () => {
    it('passes pure text unchanged', () => {
      expect(sanitizeHtml('Hello world')).toBe('Hello world');
    });

    it('passes safe tags unchanged', () => {
      expect(sanitizeHtml('<b>Bold</b>')).toBe('<b>Bold</b>');
      expect(sanitizeHtml('<span>Text</span>')).toBe('<span>Text</span>');
      expect(sanitizeHtml('<div><p>Para</p></div>')).toBe('<div><p>Para</p></div>');
      expect(sanitizeHtml('<img src="/safe.png" />')).toBe('<img src="/safe.png">');
    });

    it('handles empty and whitespace input', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml('   ')).toBe('   ');
      expect(sanitizeHtml(null as any)).toBe(null as any);
      expect(sanitizeHtml(undefined as any)).toBe(undefined as any);
    });
  });

  describe('dangerous tags should be removed', () => {
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'base', 'meta', 'link', 'style', 'template'];

    dangerousTags.forEach(tag => {
      it(`removes <${tag}> tags`, () => {
        const html = `<${tag}>payload</${tag}>`;
        const result = sanitizeHtml(`<p>Safe</p>${html}<span>Also safe</span>`);
        expect(result).not.toContain(`<${tag}>`);
        expect(result).not.toContain(`</${tag}>`);
        expect(result).toContain('Safe');
      });
    });

    it('removes <script> with content', () => {
      const html = '<script>alert("xss")</script><p>Text</p>';
      const result = sanitizeHtml(html);
      expect(result).toBe('<p>Text</p>');
    });
  });

  describe('event handler attributes should be removed', () => {
    it('removes onclick', () => {
      const result = sanitizeHtml('<button onclick="alert(1)">Click</button>');
      expect(result).not.toContain('onclick');
      expect(result).toContain('Click');
    });

    it('removes onerror on img', () => {
      const result = sanitizeHtml('<img src="x" onerror="alert(1)" />');
      expect(result).not.toContain('onerror');
      expect(result).toContain('src="x"');
    });

    it('removes onload on body', () => {
      const result = sanitizeHtml('<body onload="alert(1)">Content</body>');
      expect(result).not.toContain('onload');
    });

    it('removes onmouseover', () => {
      const result = sanitizeHtml('<div onmouseover="hack()">Hover</div>');
      expect(result).not.toContain('onmouseover');
    });

    it('removes all event handlers from one element', () => {
      const result = sanitizeHtml('<a href="#" onclick="a()" onfocus="b()">Link</a>');
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('onfocus');
    });
  });

  describe('javascript: protocol should be removed', () => {
    it('removes javascript: href', () => {
      const result = sanitizeHtml('<a href="javascript:alert(1)">Link</a>');
      expect(result).not.toContain('javascript:');
    });

    it('removes javascript: src', () => {
      const result = sanitizeHtml('<img src="javascript:alert(1)" />');
      expect(result).not.toContain('javascript:');
    });

    it('removes javascript: action on form', () => {
      const result = sanitizeHtml('<form action="javascript:alert(1)"></form>');
      expect(result).not.toContain('javascript:');
    });

    it('preserves safe href', () => {
      const result = sanitizeHtml('<a href="https://example.com">Link</a>');
      expect(result).toContain('href="https://example.com"');
    });

    it('is case-insensitive for javascript:', () => {
      const result = sanitizeHtml('<a href="JavaScript:alert(1)">Link</a>');
      expect(result).not.toContain('javascript:');
    });
  });

  describe('mixed safe and dangerous content', () => {
    it('removes dangerous parts but keeps safe parts', () => {
      const html = '<p>Safe</p><script>alert(1)</script><b>Bold</b>';
      const result = sanitizeHtml(html);
      expect(result).toContain('<p>Safe</p>');
      expect(result).toContain('<b>Bold</b>');
      expect(result).not.toContain('script');
    });

    it('handles complex nested XSS attempts', () => {
      const html = '<div><img src=x onerror=alert(1) /><p>Safe</p><script>hack()</script></div>';
      const result = sanitizeHtml(html);
      expect(result).toContain('<p>Safe</p>');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('script');
    });
  });

  describe('edge cases', () => {
    it('handles <iframe> with attributes', () => {
      const html = '<iframe src="https://evil.com" width="100" height="100"></iframe>';
      const result = sanitizeHtml(html);
      expect(result).toBe('');
    });

    it('handles <object> and <embed>', () => {
      const html = '<object data="file.swf"></object><embed src="file.swf" />';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('object');
      expect(result).not.toContain('embed');
    });

    it('handles <template> tag', () => {
      const html = '<template><script>alert(1)</script></template>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('template');
    });
  });
});
