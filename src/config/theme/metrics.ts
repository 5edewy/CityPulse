import {Dimensions} from 'react-native';

import {scale, verticalScale, isIOS} from './helpers';

const {height, width} = Dimensions.get('window');

const screenSize = Math.sqrt(height * width) / 100;
export const sw = width < height ? width : height;
export const sh = width < height ? height : width;

export const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  screenSize,
  aspectRatio: width / height,
  extraSmallMargin: scale(4),
  baseMargin: scale(10),
  bigMargin: scale(20),
  mediumMargin: scale(15),
  marginVertical: verticalScale(10),
  inputBorderRadius: scale(8),
  LATITUDE_DELTA: 0.1,
  LONGITUDE_DELTA: 0.1 * (width / height),
  navBarHeight: isIOS ? 54 : 66,
};
