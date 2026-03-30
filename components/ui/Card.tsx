import { useColorScheme, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { Theme, Colors } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'flat' | 'elevated' | 'glass';
  padding?: keyof typeof Theme.spacing;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'elevated', 
  padding = 'md', 
  children, 
  style,
  ...props 
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  return (
    <View 
      style={[
        styles.base, 
        styles[variant], 
        { 
          padding: Theme.spacing[padding],
          backgroundColor: variant === 'flat' ? themeColors.surface : (variant === 'elevated' ? themeColors.surface : themeColors.background),
          borderColor: themeColors.border
        }, 
        style
      ] as any} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  flat: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  elevated: {
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.medium,
  },
  glass: {
    backgroundColor: Theme.colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
