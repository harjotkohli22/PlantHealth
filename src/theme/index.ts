export const colors = {
  bg: '#0F1A14',
  surface: '#16241B',
  surfaceAlt: '#1E3326',
  primary: '#4ADE80',
  primaryDark: '#22C55E',
  accent: '#FACC15',
  danger: '#F87171',
  warn: '#FB923C',
  text: '#ECFDF5',
  textDim: '#9CC5AC',
  border: '#274A33',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const font = {
  h1: 30,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
};

export const severityColor = (s: 'healthy' | 'mild' | 'moderate' | 'severe') => {
  switch (s) {
    case 'healthy':
      return colors.primary;
    case 'mild':
      return colors.accent;
    case 'moderate':
      return colors.warn;
    case 'severe':
      return colors.danger;
  }
};
