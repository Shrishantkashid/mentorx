import { useColorScheme, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Theme, Colors } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', style }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  
  const variantStyles = {
    primary: { backgroundColor: 'rgba(10, 126, 164, 0.1)' },
    secondary: { backgroundColor: 'rgba(156, 39, 176, 0.1)' },
    success: { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
    warning: { backgroundColor: 'rgba(255, 152, 0, 0.1)' },
    neutral: { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F3F4F6' },
  };

  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      <ThemedText style={[styles.text, styles[`${variant}Text`]]}>{label}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  primary: { backgroundColor: 'rgba(10, 126, 164, 0.1)' },
  secondary: { backgroundColor: 'rgba(156, 39, 176, 0.1)' },
  success: { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  warning: { backgroundColor: 'rgba(255, 152, 0, 0.1)' },
  neutral: { backgroundColor: '#F3F4F6' },
  
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryText: { color: Theme.colors.primary },
  secondaryText: { color: Theme.colors.secondary },
  successText: { color: Theme.colors.success },
  warningText: { color: Theme.colors.accent },
  neutralText: { color: Theme.colors.textMuted },
});
