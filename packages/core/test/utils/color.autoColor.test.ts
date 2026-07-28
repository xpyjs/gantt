import { describe, expect, it } from 'vitest';
import { autoColor, colorjs } from '../../src/utils/color';

describe('autoColor', () => {
  describe('color is "auto" — should return #000000 or #FFFFFF based on target lightness', () => {
    it('returns black for a light target color', () => {
      expect(autoColor('auto', '#FFFFFF')).toBe('#000000');
      expect(autoColor('auto', 'rgb(255, 255, 255)')).toBe('#000000');
      expect(autoColor('auto', '#FFFAF0')).toBe('#000000');
    });

    it('returns white for a dark target color', () => {
      expect(autoColor('auto', '#000000')).toBe('#FFFFFF');
      expect(autoColor('auto', 'rgb(0, 0, 0)')).toBe('#FFFFFF');
      expect(autoColor('auto', '#111111')).toBe('#FFFFFF');
    });

    it('is case-insensitive to "auto" keyword', () => {
      expect(autoColor('AUTO', '#FFF')).toBe('#000000');
      expect(autoColor('AuTo', '#000')).toBe('#FFFFFF');
    });

    it('uses Colorjs.isLight() threshold correctly', () => {
      // isLight threshold: brightness = (r*299 + g*587 + b*114)/1000 > 128
      // A color right at the boundary
      const c1 = colorjs('#808080');
      expect(c1.isLight()).toBe(false); // brightness = 127.984
      expect(autoColor('auto', '#808080')).toBe('#FFFFFF');
    });
  });

  describe('color is NOT "auto" — should return the color unchanged', () => {
    it('returns the color string as-is', () => {
      expect(autoColor('#FF0000', '#FFFFFF')).toBe('#FF0000');
      expect(autoColor('rgb(0,0,255)', '#000')).toBe('rgb(0,0,255)');
      expect(autoColor('red', '#FFF')).toBe('red');
    });

    it('works with any non-auto color value', () => {
      expect(autoColor('#eca710', '#FFF')).toBe('#eca710');
    });
  });
});
