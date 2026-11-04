export const unit = {
  0: 0,
  2: 2,
  4: 4,
  8: 8,
  10: 10,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  36: 36,
  40: 40,
  44: 44,
  48: 48,
  52: 52,
  56: 56,
  60: 60,
  64: 64,
  68: 68,
  72: 72,
  999: 999,
} as const;

export const radius = {
  small: unit[4],
  medium: unit[8],
  large: unit[16],
  full: unit[999],
} as const;

export const padding = {
  4: unit[4],
  8: unit[8],
  12: unit[12],
  16: unit[16],
  20: unit[20],
  24: unit[24],
} as const;

export const gap = {
  2: unit[2],
  4: unit[4],
  8: unit[8],
  12: unit[12],
  16: unit[16],
  20: unit[20],
  24: unit[24],
  28: unit[28],
  32: unit[32],
  36: unit[36],
  40: unit[40],
  48: unit[48],
  56: unit[56],
  64: unit[64],
  72: unit[72],
} as const;

export const lineWeight = {
  subtle: 0.5,
  regular: 1,
  semiBold: 1.5,
  bold: 2,
} as const;

export const grid = {
  margin: unit[24],
  gutter: unit[8],
} as const;
