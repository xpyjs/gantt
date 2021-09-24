const reRGBA = /^rgb(a)?\((\d{1,3}),(\d{1,3}),(\d{1,3}),?([01]?\.?\d*?)?\)$/;

interface Rgba {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function hexToRgb(hex: string) {
  if (typeof hex !== "string") {
    throw new TypeError("Expected a string");
  }

  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  } else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const num = parseInt(hex, 16);

  return hex.length > 6
    ? {
        r: (num >> 24) & 255,
        g: (num >> 16) & 255,
        b: (num >> 8) & 255,
        a: Math.round((num & 255) / 2.55)
      }
    : { r: num >> 16, g: (num >> 8) & 255, b: num & 255 };
}

export function textToRgb(str: string) {
  if (typeof str !== "string") {
    throw new TypeError("Expected a string");
  }

  const color = str.replace(/ /g, "");

  const m = reRGBA.exec(color);

  if (m === null) {
    return hexToRgb(color);
  }

  const rgb: Rgba = {
    r: Math.min(255, parseInt(m[2], 10)),
    g: Math.min(255, parseInt(m[3], 10)),
    b: Math.min(255, parseInt(m[4], 10))
  };

  if (m[1]) {
    const alpha = parseFloat(m[5]);
    rgb.a = Math.min(1, isNaN(alpha) === true ? 1 : alpha) * 100;
  }

  return rgb;
}

function rgbToHex({ r, g, b, a }: Rgba) {
  const alpha = a !== void 0;

  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  if (r > 255 || g > 255 || b > 255 || (alpha && (a as number) > 100)) {
    throw new TypeError(
      "Expected 3 numbers below 256 (and optionally one below 100)"
    );
  }

  const _a = alpha
    ? (Math.round((255 * (a as number)) / 100) | (1 << 8)).toString(16).slice(1)
    : "";

  return (
    "#" + (b | (g << 8) | (r << 16) | (1 << 24)).toString(16).slice(1) + _a
  );
}

export function changeAlpha(color: string, alpha: number) {
  if (typeof color !== "string") {
    throw new TypeError("Expected a string as color");
  }

  if (alpha === void 0 || alpha < 0 || alpha > 1) {
    throw new TypeError("Expected offset to be between 0 and 1");
  }

  const { r, g, b } = textToRgb(color);

  return rgbToHex({
    r,
    g,
    b,
    a: Math.round(Math.min(1, Math.max(0, alpha)) * 100)
  });
}
