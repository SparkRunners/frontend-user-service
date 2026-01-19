/**
 * Design Tokens - SparkRunner Design System
 * Design specifications consistent with mobile app
 */

export const colors = {
  // Brand Colors
  brand: '#22C55E',
  brandMuted: '#D1FAE5',
  brandDark: '#16A34A',

  // Status Colors
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
  success: '#10B981',

  // Neutral Colors
  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
};

export const radii = {
  pill: '999px',
  control: '16px',
  card: '24px',
};

export const typography = {
  titleXL: {
    fontSize: '28px',
    lineHeight: '34px',
    fontWeight: 700,
  },
  titleL: {
    fontSize: '22px',
    lineHeight: '28px',
    fontWeight: 700,
  },
  titleM: {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 600,
  },
  bodyM: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 500,
  },
  bodyS: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 500,
  },
  caption: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
  },
  numeric: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 600,
  },
};

export const shadows = {
  soft: '0 12px 24px rgba(15, 23, 42, 0.1)',
  medium: '0 4px 12px rgba(15, 23, 42, 0.15)',
  hard: '0 2px 8px rgba(15, 23, 42, 0.2)',
};

export const buttons = {
  primary: {
    background: colors.brand,
    foreground: '#FFFFFF',
    hover: colors.brandDark,
  },
  secondary: {
    background: '#F3F4F6',
    foreground: colors.text,
    hover: '#E5E7EB',
  },
  danger: {
    background: colors.danger,
    foreground: '#FFFFFF',
    hover: '#DC2626',
  },
};

export const badges = {
  success: {
    background: colors.brandMuted,
    foreground: colors.brand,
  },
  warning: {
    background: '#FEF3C7',
    foreground: colors.warning,
  },
  danger: {
    background: '#FEE2E2',
    foreground: colors.danger,
  },
  info: {
    background: '#DBEAFE',
    foreground: colors.info,
  },
};
