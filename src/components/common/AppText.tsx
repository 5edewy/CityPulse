import {StyleProp, StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import React, {memo} from 'react';
import {colors} from '../../config/theme';

interface Props extends TextProps {
  children?: any;
  style?: StyleProp<TextStyle>;
}

export const AppText = memo(({children, style, ...restProps}: Props) => {
  return (
    <Text
      testID="globalAppText"
      style={[styles.text, style]}
      {...restProps}
      allowFontScaling={false}>
      {children}
    </Text>
  );
});

const styles = StyleSheet.create({
  text: {
    color: colors.black,
  },
});
