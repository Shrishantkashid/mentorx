export const Colors = {
  light: {
    text: '#1F2937',
    background: '#FFFFFF',
    tint: '#0a7ea4',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
    border: '#E5E7EB',
    surface: '#F8F9FA',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    border: '#3F3F3F',
    surface: '#242424',
  },
};

export const Theme = {
  colors: {
    primary: '#0a7ea4',
    secondary: '#9C27B0',
    accent: '#FF9800',
    warning: '#FFC107',
    success: '#4CAF50',
    error: '#F44336',
    white: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.8)',
    // Re-linking to adaptive colors for consistency
    text: Colors.light.text, 
    background: Colors.light.background,
    border: Colors.light.border,
    surface: Colors.light.surface,
    textMuted: '#6B7280',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    dark: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700' as const },
    h2: { fontSize: 24, fontWeight: '700' as const },
    h3: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '400' as const },
    button: { fontSize: 16, fontWeight: '600' as const },
  }
};
