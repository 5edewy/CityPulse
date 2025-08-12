import {
  Dimensions,
  Platform,
  PixelRatio,
  ToastAndroid,
  Alert,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scaleWidth = width / guidelineBaseWidth;

const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;

function normalizeFontSize(size: number) {
  const newSize = size * scaleWidth;

  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
}

const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;

export const calculateWidth = (target = 375) => {
  return width * (target / 375);
};

export const calculateWidthRatio = (target: number, parent = 375) => {
  let ratio = ((target / parent) * 100.0).toString() + '%';
  return ratio;
};

export const calcHeight = (target = 812) => {
  return height * (target / 812);
};

const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const isIOS = Platform.OS === 'ios';

function renderError(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
}

export {
  normalizeFontSize,
  scale,
  verticalScale,
  moderateScale,
  isIOS,
  renderError,
};
