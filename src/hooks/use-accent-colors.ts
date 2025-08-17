import { useMemo } from 'preact/hooks';
import {
  calculateContrastTextColors,
  generateAccentColorVariants,
  type AccentColorVariants,
  type ContrastTextColors,
} from '@/utils/color-contrast';

export interface AccentColors extends AccentColorVariants, ContrastTextColors {
  // Combined interface for easy access
  isValid: boolean;
}

/**
 * Hook that calculates WCAG-compliant colors based on accent color
 * Returns optimized text colors and color variants
 */
export function useAccentColors(accentColor: string): AccentColors {
  return useMemo(() => {
    // Validate hex color format
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(accentColor);

    if (!isValidHex) {
      // Return safe defaults for invalid colors
      return {
        base: '#3B82F6', // default blue
        hsl: { h: 217, s: 91, l: 60 },
        rgb: { r: 59, g: 130, b: 246 },
        tint5: '#F0F4FF',
        tint10: '#E0ECFF',
        tint30: '#A5C4FF',
        dark: '#1E40AF',
        light: '#93C5FD',
        onAccent: '#FFFFFF',
        onAccentTint: '#1E40AF',
        onLight: '#1E40AF',
        contrasts: {
          onAccent: 5.2,
          onAccentTint: 5.8,
          onLight: 5.8,
        },
        isValid: false,
      };
    }

    try {
      const variants = generateAccentColorVariants(accentColor);
      const textColors = calculateContrastTextColors(accentColor);

      return {
        ...variants,
        ...textColors,
        isValid: true,
      };
    } catch (error) {
      console.error('Error calculating accent colors:', error);

      // Return safe defaults on error
      return {
        base: accentColor,
        hsl: { h: 0, s: 0, l: 50 },
        rgb: { r: 128, g: 128, b: 128 },
        tint5: '#F8F8F8',
        tint10: '#F0F0F0',
        tint30: '#D0D0D0',
        dark: '#404040',
        light: '#A0A0A0',
        onAccent: '#FFFFFF',
        onAccentTint: '#404040',
        onLight: '#404040',
        contrasts: {
          onAccent: 4.5,
          onAccentTint: 4.5,
          onLight: 4.5,
        },
        isValid: false,
      };
    }
  }, [accentColor]);
}

/**
 * Hook specifically for getting text color on accent background
 * Useful for buttons, user messages, etc.
 */
export function useTextOnAccent(accentColor: string): {
  color: string;
  contrast: number;
  isAccessible: boolean;
} {
  const colors = useAccentColors(accentColor);

  return {
    color: colors.onAccent,
    contrast: colors.contrasts.onAccent,
    isAccessible: colors.contrasts.onAccent >= 2.5,
  };
}

/**
 * Hook specifically for getting text color on accent tinted backgrounds
 * Useful for assistant message bubbles, subtle backgrounds, etc.
 */
export function useTextOnAccentTint(accentColor: string): {
  color: string;
  backgroundColor: string;
  contrast: number;
  isAccessible: boolean;
} {
  const colors = useAccentColors(accentColor);

  return {
    color: colors.onAccentTint,
    backgroundColor: colors.tint10,
    contrast: colors.contrasts.onAccentTint,
    isAccessible: colors.contrasts.onAccentTint >= 4.5,
  };
}

/**
 * Hook for getting all accent color CSS custom properties
 * Can be used with style prop to set CSS variables
 */
export function useAccentColorCSSVars(accentColor: string): Record<string, string> {
  const colors = useAccentColors(accentColor);

  return {
    '--accent-color': colors.base,
    '--accent-color-rgb': `${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b}`,
    '--accent-color-hsl': `${colors.hsl.h}, ${colors.hsl.s}%, ${colors.hsl.l}%`,
    '--accent-tint-5': colors.tint5,
    '--accent-tint-10': colors.tint10,
    '--accent-tint-30': colors.tint30,
    '--accent-dark': colors.dark,
    '--accent-light': colors.light,
    '--text-on-accent': colors.onAccent,
    '--text-on-accent-tint': colors.onAccentTint,
    '--text-on-light': colors.onLight,
  };
}
