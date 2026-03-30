import { useColorScheme, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Theme, Colors } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  style,
  textStyle,
  ...props 
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  const variantStyles = {
    primary: { backgroundColor: Theme.colors.primary },
    secondary: { backgroundColor: Theme.colors.secondary },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Theme.colors.primary },
    ghost: { backgroundColor: 'transparent' },
  };

  const textVariantStyles = {
    primary: { color: Theme.colors.white },
    secondary: { color: Theme.colors.white },
    outline: { color: Theme.colors.primary },
    ghost: { color: colorScheme === 'dark' ? themeColors.text : Theme.colors.primary },
  };
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={[
        styles.base, 
        variantStyles[variant], 
        styles[size],
        fullWidth && styles.fullWidth,
        style
      ]} 
      {...props}
    >
      <ThemedText style={[
        styles.textBase, 
        textVariantStyles[variant], 
        styles[`${size}Text`],
        textStyle
      ]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Theme.colors.primary,
  },
  secondary: {
    backgroundColor: Theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: { paddingVertical: 8, paddingHorizontal: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 24 },
  lg: { paddingVertical: 16, paddingHorizontal: 32 },
  fullWidth: { width: '100%' },
  textBase: {
    fontWeight: '600',
  },
  primaryText: { color: Theme.colors.white },
  secondaryText: { color: Theme.colors.white },
  outlineText: { color: Theme.colors.primary },
  ghostText: { color: Theme.colors.primary },
  smText: { fontSize: 13 },
  mdText: { fontSize: 16 },
  lgText: { fontSize: 18 },
});
