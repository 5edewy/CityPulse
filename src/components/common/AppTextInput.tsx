import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';

import {scale, colors, normalizeFontSize} from '../../config/theme';

interface Props extends TextInputProps {
  onSubmit?: () => void;
  appearIndicator?: boolean;
  iconInput?: string | any;
  iconStyle?: any;
  styleInput?: StyleProp<ViewStyle>;
  container?: StyleProp<ViewStyle>;
  inputContainer?: StyleProp<ViewStyle>;
  isInvalid?: boolean;
  activeTintColor?: boolean;
  appearIcon?: boolean;
  buttonAccessibilityLabel?: string;
  textInputAccessibilityLabel?: string;
  inputRef?: any;

  value?: any;
}

export const AppTextInput = memo(
  ({
    onSubmit,
    appearIndicator = false,
    keyboardType,
    value,
    maxLength,
    iconInput,
    iconStyle,
    children,
    styleInput,
    container,
    inputContainer,
    isInvalid,

    activeTintColor = true,
    appearIcon = true,
    buttonAccessibilityLabel,
    textInputAccessibilityLabel,
    inputRef,

    ...restInputProps
  }: Props) => {
    const rowStyle = 'row';

    return (
      <View style={[{marginBottom: scale(15)}, container]}>
        <View style={[styles.inputContainer, styleInput]}>
          <View style={styles.rowContainer}>
            {appearIcon && (
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!onSubmit}
                accessibilityLabel={buttonAccessibilityLabel}>
                <Image
                  source={iconInput}
                  style={[styles.phone, iconStyle]}
                  tintColor={
                    activeTintColor
                      ? colors[value ? 'black' : 'warmGrey']
                      : undefined
                  }
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            <TextInput
              ref={inputRef}
              style={[styles.textInput, inputContainer]}
              keyboardType={keyboardType}
              maxLength={maxLength}
              value={value}
              placeholderTextColor={colors.warmGrey}
              onSubmitEditing={onSubmit}
              accessibilityLabel={textInputAccessibilityLabel}
              allowFontScaling={false}
              {...restInputProps}
            />
            {children}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(5),
    borderRadius: scale(8),
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    width: '100%',
    borderWidth: scale(0.5),
    backgroundColor: colors.backgroundGray,
    height: scale(41),
    alignSelf: 'center',
    borderColor: colors.grayTransparent5,
  },
  textInput: {
    paddingHorizontal: scale(8),
    color: '#202020',
    width: 'auto',
    flex: 1,
    textAlign: 'left',
    fontSize: normalizeFontSize(12.5),
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(5),
    flex: 1,
  },
  phone: {
    width: scale(14),
    height: scale(14),
  },
  indicator: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: scale(5),
    paddingRight: scale(15),
    height: scale(30),
    alignSelf: 'center',
  },
  indicatorAR: {
    borderLeftWidth: scale(1),
    borderLeftColor: colors.galleryGray,
  },
  indicatorENG: {
    borderRightWidth: scale(1),
    borderRightColor: colors.galleryGray,
  },
  titelText: {
    paddingHorizontal: scale(5),

    fontSize: scale(12),
  },
  imageFlag: {
    width: scale(16),
    height: scale(11),
  },
  error: {
    color: colors.error,
    fontSize: scale(10),
    paddingLeft: scale(5),
  },
  upperlabelText: {
    fontSize: normalizeFontSize(12.15),
    color: colors.lightBlack,
    marginBottom: scale(5),
  },
});
