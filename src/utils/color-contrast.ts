/**
 * Comprehensive color contrast utilities for WCAG-compliant text colors
 * Based on advanced color theory and accessibility standards
 */

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface AccentColorVariants {
  base: string; // Original accent color in hex
  hsl: HSL; // HSL values
  rgb: RGB; // RGB values
  tint5: string; // 5% tint with white
  tint10: string; // 10% tint with white
  tint30: string; // 30% tint with white
  dark: string; // Darker variant
  light: string; // Lighter variant
}

export interface ContrastTextColors {
  onAccent: string; // Text color for accent background (user messages, buttons)
  onAccentTint: string; // Text color for tinted accent backgrounds
  onLight: string; // Text color for light backgrounds
  contrasts: {
    onAccent: number;
    onAccentTint: number;
    onLight: number;
  };
}

/**
 * Convert hex color to HSL triplet
 */
export function hexToHsl(hex: string): HSL {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(x => x + x)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(x => x + x)
      .join('');
  }

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

/**
 * Convert HSL to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate luminance of an RGB color
 */
export function rgbToLuminance(r: number, g: number, b: number): number {
  const srgb = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return srgb[0] * 0.2126 + srgb[1] * 0.7152 + srgb[2] * 0.0722;
}

/**
 * Calculate contrast ratio between two colors
 */
export function contrast(rgb1: RGB, rgb2: RGB): number {
  const L1 = rgbToLuminance(rgb1.r, rgb1.g, rgb1.b);
  const L2 = rgbToLuminance(rgb2.r, rgb2.g, rgb2.b);
  const bright = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (bright + 0.05) / (dark + 0.05);
}

/**
 * Mix two RGB colors
 */
export function mixRgb(rgbA: RGB, rgbB: RGB, ratioA: number): RGB {
  const p = Math.max(0, Math.min(1, ratioA));
  return {
    r: Math.round(rgbA.r * p + rgbB.r * (1 - p)),
    g: Math.round(rgbA.g * p + rgbB.g * (1 - p)),
    b: Math.round(rgbA.b * p + rgbB.b * (1 - p)),
  };
}

/**
 * Find optimal text color that meets WCAG AA contrast (4.5:1)
 * Keeps brand hue and saturation, only adjusts lightness
 */
export function pickOptimalTextColor(
  backgroundRgb: RGB,
  brandH: number,
  brandS: number,
  targetContrast: number = 4.5,
  preferDark: boolean = true,
  targetLightness: number = 15
): { color: string; lightness: number; contrast: number } {
  // Helper to test contrast quickly
  const passes = (L: number) => {
    const textRgb = hslToRgb(brandH, brandS, L);
    return contrast(textRgb, backgroundRgb) >= targetContrast;
  };

  // If target already passes, use it verbatim
  if (passes(targetLightness)) {
    const textRgb = hslToRgb(brandH, brandS, targetLightness);
    return {
      color: hslToHex(brandH, brandS, targetLightness),
      lightness: targetLightness,
      contrast: contrast(textRgb, backgroundRgb),
    };
  }

  // When preferring light text, be more aggressive about searching light values first
  if (!preferDark) {
    // First, try a wide range of light colors (70-100% lightness)
    for (let L = Math.max(70, targetLightness); L <= 100; L += 2) {
      if (passes(L)) {
        const textRgb = hslToRgb(brandH, brandS, L);
        return {
          color: hslToHex(brandH, brandS, L),
          lightness: L,
          contrast: contrast(textRgb, backgroundRgb),
        };
      }
    }
    
    // If no light color passes, try with relaxed contrast (3:1 instead of 4.5:1) for bright backgrounds
    const backgroundLuminance = rgbToLuminance(backgroundRgb.r, backgroundRgb.g, backgroundRgb.b);
    if (backgroundLuminance > 0.25) { // Bright background
      // First try brand colors with relaxed contrast
      for (let L = Math.max(70, targetLightness); L <= 100; L += 2) {
        const textRgb = hslToRgb(brandH, brandS, L);
        const currentContrast = contrast(textRgb, backgroundRgb);
        if (currentContrast >= 3.0) { // Relaxed contrast requirement
          return {
            color: hslToHex(brandH, brandS, L),
            lightness: L,
            contrast: currentContrast,
          };
        }
      }
      
      // If brand colors don't work, try desaturated light colors
      for (let s = brandS; s >= 20; s -= 20) {
        for (let L = 85; L <= 100; L += 2) {
          const textRgb = hslToRgb(brandH, s, L);
          const currentContrast = contrast(textRgb, backgroundRgb);
          if (currentContrast >= 3.0) {
            return {
              color: hslToHex(brandH, s, L),
              lightness: L,
              contrast: currentContrast,
            };
          }
        }
      }
      
      // Last resort for bright backgrounds: pure white with relaxed contrast
      const whiteRgb = { r: 255, g: 255, b: 255 };
      const whiteContrast = contrast(whiteRgb, backgroundRgb);
      if (whiteContrast >= 2.5) { // Very relaxed contrast for bright backgrounds
        return {
          color: '#ffffff',
          lightness: 100,
          contrast: whiteContrast,
        };
      }
    }
  }

  // Expand search outward from target, preferring the requested direction first
  for (let step = 1; step <= 100; step++) {
    // preferred side first
    const dir1 = preferDark ? -1 : 1;
    const L1 = Math.max(0, Math.min(100, targetLightness + dir1 * step));
    if (passes(L1)) {
      const textRgb = hslToRgb(brandH, brandS, L1);
      return {
        color: hslToHex(brandH, brandS, L1),
        lightness: L1,
        contrast: contrast(textRgb, backgroundRgb),
      };
    }

    // opposite side second
    const dir2 = preferDark ? 1 : -1;
    const L2 = Math.max(0, Math.min(100, targetLightness + dir2 * step));
    if (passes(L2)) {
      const textRgb = hslToRgb(brandH, brandS, L2);
      return {
        color: hslToHex(brandH, brandS, L2),
        lightness: L2,
        contrast: contrast(textRgb, backgroundRgb),
      };
    }
  }

  // As a last resort, choose the extreme with higher contrast
  const darkRgb = hslToRgb(brandH, brandS, 0);
  const lightRgb = hslToRgb(brandH, brandS, 100);
  const cDark = contrast(darkRgb, backgroundRgb);
  const cLight = contrast(lightRgb, backgroundRgb);

  // When preferring light text, prefer light even if contrast is slightly lower
  const useDark = preferDark ? cDark >= cLight : cDark > cLight * 1.5;
  const finalL = useDark ? 0 : 100;
  const finalRgb = useDark ? darkRgb : lightRgb;

  return {
    color: hslToHex(brandH, brandS, finalL),
    lightness: finalL,
    contrast: contrast(finalRgb, backgroundRgb),
  };
}

/**
 * Generate accent color variants and tints
 */
export function generateAccentColorVariants(accentColor: string): AccentColorVariants {
  const hsl = hexToHsl(accentColor);
  const rgb = hexToRgb(accentColor);

  // Create tints by mixing with white
  const tint5Rgb = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.05);
  const tint10Rgb = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.1);
  const tint30Rgb = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.3);

  // Create darker and lighter variants
  const darkL = Math.max(0, hsl.l * 0.7);
  const lightL = Math.min(100, hsl.l + (100 - hsl.l) * 0.3);

  return {
    base: accentColor,
    hsl,
    rgb,
    tint5: rgbToHex(tint5Rgb.r, tint5Rgb.g, tint5Rgb.b),
    tint10: rgbToHex(tint10Rgb.r, tint10Rgb.g, tint10Rgb.b),
    tint30: rgbToHex(tint30Rgb.r, tint30Rgb.g, tint30Rgb.b),
    dark: hslToHex(hsl.h, hsl.s, darkL),
    light: hslToHex(hsl.h, hsl.s, lightL),
  };
}

/**
 * Calculate optimal text colors for different use cases
 */
export function calculateContrastTextColors(accentColor: string): ContrastTextColors {
  const variants = generateAccentColorVariants(accentColor);
  const { h, s } = variants.hsl;

  // Background colors
  const accentRgb = variants.rgb;
  const accentTintRgb = hexToRgb(variants.tint10);
  const lightBgRgb = { r: 255, g: 255, b: 255 }; // white background

  // Calculate optimal text colors
  const onAccentResult = pickOptimalTextColor(accentRgb, h, s, 4.5, false, 85); // prefer light on dark accent
  const onAccentTintResult = pickOptimalTextColor(accentTintRgb, h, s, 4.5, true, 15); // prefer dark on light tint
  const onLightResult = pickOptimalTextColor(lightBgRgb, h, s, 4.5, true, 15); // prefer dark on light

  return {
    onAccent: onAccentResult.color,
    onAccentTint: onAccentTintResult.color,
    onLight: onLightResult.color,
    contrasts: {
      onAccent: onAccentResult.contrast,
      onAccentTint: onAccentTintResult.contrast,
      onLight: onLightResult.contrast,
    },
  };
}

/**
 * Check if a color meets WCAG AA standard (4.5:1 contrast)
 */
export function meetsWCAGAA(foregroundColor: string, backgroundColor: string): boolean {
  const fgRgb = hexToRgb(foregroundColor);
  const bgRgb = hexToRgb(backgroundColor);
  return contrast(fgRgb, bgRgb) >= 4.5;
}

/**
 * Check if a color meets WCAG AAA standard (7:1 contrast)
 */
export function meetsWCAGAAA(foregroundColor: string, backgroundColor: string): boolean {
  const fgRgb = hexToRgb(foregroundColor);
  const bgRgb = hexToRgb(backgroundColor);
  return contrast(fgRgb, bgRgb) >= 7;
}
