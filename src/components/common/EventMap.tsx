import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import {colors, scale, normalizeFontSize} from '../../config/theme';
import {AppText} from '../common/AppText';

type Props = {
  lat: number;
  lng: number;
  title?: string;
  subtitle?: string;
  height?: number;
};

export const EventMap: React.FC<Props> = ({
  lat,
  lng,
  title,
  subtitle,
  height = scale(180),
}) => {
  const region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  return (
    <View style={[styles.wrap, {height}]}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        pitchEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsScale={false}>
        <Marker coordinate={{latitude: lat, longitude: lng}} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: scale(12),
    overflow: 'hidden',
    borderWidth: scale(1),
    borderColor: colors.grayTransparent5,
    backgroundColor: colors.white,
    marginTop: scale(10),
  },
});
