export const fontSize = {
  10: 10,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  30: 30,
} as const;

export const lineHeight = {
  10: 14,
  12: 16,
  13: 18,
  14: 20,
  15: 22,
  16: 24,
  18: 26,
  20: 28,
  22: 30,
} as const;

export const letterSpacing = {
  none: 0,
  normal: -0.2,
  tight: -0.6,
} as const;

export const fontWeight = {
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

const text = (
  size: keyof typeof fontSize,
  weight: keyof typeof fontWeight,
  height: keyof typeof lineHeight,
  spacing: keyof typeof letterSpacing,
) => ({
  fontSize: fontSize[size],
  fontWeight: fontWeight[weight],
  lineHeight: lineHeight[height],
  letterSpacing: letterSpacing[spacing],
});

export const typography = {
  title: {
    1: { bold: text(30, 'bold', 22, 'normal') },
    2: {
      bold: text(24, 'bold', 20, 'normal'),
      semiBold: text(24, 'semiBold', 20, 'normal'),
    },
  },
  heading: {
    1: {
      bold: text(20, 'bold', 18, 'normal'),
      semiBold: text(20, 'semiBold', 18, 'normal'),
    },
  },
  body: {
    1: {
      bold: text(18, 'bold', 16, 'normal'),
      semiBold: text(18, 'semiBold', 16, 'normal'),
      medium: text(18, 'medium', 16, 'normal'),
    },
    2: {
      bold: text(16, 'bold', 15, 'normal'),
      semiBold: text(16, 'semiBold', 15, 'normal'),
      medium: text(16, 'medium', 15, 'normal'),
    },
    3: {
      bold: text(15, 'bold', 14, 'none'),
      semiBold: text(15, 'semiBold', 14, 'none'),
      medium: text(15, 'medium', 14, 'none'),
    },
    4: {
      semiBold: text(14, 'semiBold', 13, 'none'),
      medium: text(14, 'medium', 13, 'none'),
    },
    5: {
      semiBold: text(13, 'semiBold', 12, 'none'),
      medium: text(13, 'medium', 12, 'none'),
    },
  },
  caption: {
    1: {
      bold: text(12, 'bold', 10, 'none'),
      semiBold: text(12, 'semiBold', 10, 'none'),
      medium: text(12, 'medium', 10, 'none'),
    },
  },
} as const;
