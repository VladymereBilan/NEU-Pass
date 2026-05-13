import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  disabled,
}) => {
  const textStyle = variant === 'secondary' ? styles.textSecondary : styles.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.primary,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#0b3d91',
  },
  secondary: {
    backgroundColor: '#e6eefc',
    borderWidth: 1,
    borderColor: '#0b3d91',
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textSecondary: {
    color: '#0b3d91',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
