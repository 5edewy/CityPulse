// src/screens/EventDetails/EventDetailsScreen.tsx
import React, {useCallback, useMemo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Share,
  Platform,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useEventDetails} from '../hooks';
import {AppText, VectorIcon} from '../components/common';
import {colors, normalizeFontSize, scale} from '../config/theme';

export const EventDetailsScreen = () => {
  const {params} = useRoute<any>();
  const nav = useNavigation<any>();
  const id = params?.id as string;

  const {data, isLoading, error} = useEventDetails(id);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <AppText>{String((error as Error).message)}</AppText>
      </View>
    );
  }
  if (!data) {
    return (
      <View style={styles.center}>
        <AppText>Not found</AppText>
      </View>
    );
  }

  const img = data?.images?.[0]?.url as string | undefined;
  const venue = data?._embedded?.venues?.[0];
  const cityName = venue?.city?.name;
  const venueName = venue?.name;
  const dateTime = data?.dates?.start?.dateTime;
  const tmUrl = data?.url;

  const lat = parseFloat(venue?.location?.latitude ?? '');
  const lng = parseFloat(venue?.location?.longitude ?? '');
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  const formattedDate = () => {
    if (!dateTime) return undefined;
    try {
      return new Date(dateTime).toLocaleString();
    } catch {
      return dateTime;
    }
  };

  const onOpenTicketmaster = () => {
    if (tmUrl) Linking.openURL(tmUrl);
  };

  const onOpenMaps = () => {
    if (!hasCoords) return;
    const q = encodeURIComponent(
      `${data?.name || 'Event'} @ ${venueName || ''}`,
    );
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${q}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${q})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${data?.name}${tmUrl ? ` · ${tmUrl}` : ''}`,
      });
    } catch {}
  };

  return (
    <ScrollView contentContainerStyle={{paddingBottom: scale(24)}}>
      {/* Header image */}
      <View style={styles.imageWrap}>
        {img ? (
          <Image source={{uri: img}} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        {/* Top controls */}
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => nav.goBack()}>
            <VectorIcon
              type="Ionicons"
              name="chevron-back"
              size={scale(18)}
              color={colors.white}
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', gap: scale(8)}}>
            <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
              <VectorIcon
                type="Ionicons"
                name="share-social-outline"
                size={scale(18)}
                color={colors.white}
              />
            </TouchableOpacity>
            {tmUrl ? (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={onOpenTicketmaster}>
                <VectorIcon
                  type="Ionicons"
                  name="logo-usd"
                  size={scale(18)}
                  color={colors.white}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Body card */}
      <View style={styles.card}>
        <AppText style={styles.title}>{data?.name}</AppText>
        {(cityName || venueName) && (
          <AppText style={styles.subtitle}>
            {cityName}
            {venueName ? ` • ${venueName}` : ''}
          </AppText>
        )}

        {/* Info rows */}
        {formattedDate ? (
          <InfoRow icon="calendar-outline" text={formattedDate} />
        ) : null}
        {cityName || venueName ? (
          <InfoRow
            icon="location-outline"
            text={`${cityName || ''}${venueName ? ` • ${venueName}` : ''}`}
          />
        ) : null}

        {/* Price ranges (if available) */}
        {Array.isArray(data?.priceRanges) && data.priceRanges.length > 0 && (
          <InfoRow
            icon="pricetag-outline"
            text={`${data.priceRanges[0].min ?? ''} - ${
              data.priceRanges[0].max ?? ''
            } ${data.priceRanges[0].currency ?? ''}`}
          />
        )}

        {/* Categories */}
        {Array.isArray(data?.classifications) &&
          data.classifications.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: scale(6),
                marginTop: scale(8),
              }}>
              {data.classifications.slice(0, 4).map((c: any, idx: number) => {
                const label =
                  c?.segment?.name ||
                  c?.genre?.name ||
                  c?.subGenre?.name ||
                  'General';
                return (
                  <View key={`cls-${idx}`} style={styles.chip}>
                    <AppText style={styles.chipText}>{label}</AppText>
                  </View>
                );
              })}
            </View>
          )}

        {/* Map preview (only if coords exist) */}
        {hasCoords ? (
          <View style={styles.mapPreview}>
            <VectorIcon
              type="Ionicons"
              name="map-outline"
              size={scale(18)}
              color={colors.primary}
            />
            <AppText style={styles.mapText}>
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </AppText>
            <TouchableOpacity style={styles.mapBtn} onPress={onOpenMaps}>
              <AppText style={styles.mapBtnText}>Open in Maps</AppText>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actionsRow}>
          {tmUrl ? (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={onOpenTicketmaster}>
              <VectorIcon
                type="Ionicons"
                name="open-outline"
                size={scale(16)}
                color={colors.white}
              />
              <AppText style={styles.primaryBtnText}>
                Open in Ticketmaster
              </AppText>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => nav.goBack()}>
            <VectorIcon
              type="Ionicons"
              name="arrow-undo-outline"
              size={scale(16)}
              color={colors.primary}
            />
            <AppText style={styles.secondaryBtnText}>Back</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

function InfoRow({icon, text}: {icon: string; text: string | any}) {
  return (
    <View style={styles.infoRow}>
      <VectorIcon
        type="Ionicons"
        name={icon as any}
        size={scale(16)}
        color={colors.sonicSilverGray}
      />
      <AppText style={styles.infoText} numberOfLines={2}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mainbgLightBlue,
  },

  imageWrap: {
    height: scale(220),
    backgroundColor: colors.grayTransparent9,
    borderBottomLeftRadius: scale(16),
    borderBottomRightRadius: scale(16),
    overflow: 'hidden',
  },
  image: {width: '100%', height: '100%'},
  imagePlaceholder: {backgroundColor: colors.grayTransparent10},

  topbar: {
    position: 'absolute',
    top: scale(12),
    left: scale(12),
    right: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.blackTrasparent6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: colors.backgroundGray,
    borderRadius: scale(14),
    padding: scale(16),
    borderWidth: scale(0.5),
    borderColor: colors.grayTransparent5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
    margin: scale(16),
    marginTop: scale(12),
  },
  title: {
    fontSize: normalizeFontSize(18),
    color: colors.black,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: scale(4),
    marginBottom: scale(12),
    fontSize: normalizeFontSize(12.5),
    color: colors.sonicSilverGray,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(6),
  },
  infoText: {
    flex: 1,
    color: colors.lightBlack,
    fontSize: normalizeFontSize(11.5),
  },

  chip: {
    paddingHorizontal: scale(10),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: colors.white,
    borderWidth: scale(1),
    borderColor: colors.grayTransparent5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    color: colors.lightBlack,
    fontSize: normalizeFontSize(10.5),
    fontWeight: '700',
  },

  mapPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    padding: scale(10),
    borderRadius: scale(12),
    borderWidth: scale(1),
    borderColor: colors.grayTransparent5,
    backgroundColor: colors.white,
    marginTop: scale(10),
  },
  mapText: {
    flex: 1,
    color: colors.lightBlack,
    fontSize: normalizeFontSize(11),
  },
  mapBtn: {
    paddingHorizontal: scale(10),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBtnText: {
    color: colors.white,
    fontSize: normalizeFontSize(11),
    fontWeight: '700',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: scale(10),
    marginTop: scale(12),
  },
  primaryBtn: {
    flex: 1,
    height: scale(44),
    borderRadius: scale(10),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(6),
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: normalizeFontSize(13.5),
    fontWeight: '700',
  },
  secondaryBtn: {
    height: scale(44),
    paddingHorizontal: scale(14),
    borderRadius: scale(10),
    backgroundColor: colors.white,
    borderWidth: scale(1),
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(6),
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: normalizeFontSize(12),
    fontWeight: '700',
  },
});
