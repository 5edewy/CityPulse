import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {AppText} from './AppText';
import {scale, colors, normalizeFontSize, metrics} from '../../config/theme';

interface ButtonProps {
  style?: any;
  disabled?: boolean | undefined;
  spinnerColor?: any;
  loading?: Boolean | undefined | any;
  onPress?: void | any;
  textBtn?: any;
  styleBtnText?: Object | any;
}

export const AppButton = memo(
  ({
    style,
    disabled,
    spinnerColor = colors.whisperGrey,
    loading,
    onPress,
    textBtn,
    styleBtnText,
  }: ButtonProps) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled || loading}
        onPress={!disabled && onPress}
        style={[
          styles.loginButton,
          style,
          disabled && {backgroundColor: colors.darkGray2},
        ]}>
        {loading ? (
          <ActivityIndicator color={spinnerColor} size="small" />
        ) : (
          <>
            <AppText style={[styles.btnText, styleBtnText]}>{textBtn}</AppText>
          </>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: scale(7),
    backgroundColor: colors.primary,
    height: scale(45),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: normalizeFontSize(14),
  },
  iconStyle: {
    width: scale(12),
    height: scale(12),
    marginRight: scale(7),
  },
});
