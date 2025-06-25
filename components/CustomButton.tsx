import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  style = {},
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? '#bbb' : '#47b5ff',
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
