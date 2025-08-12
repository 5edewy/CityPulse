import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import {useRoute, NavigationProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useEventDetails} from '../hooks';
import {AppText, EventMap, VectorIcon} from '../components/common';
import {colors, normalizeFontSize, scale} from '../config/theme';
import {useStore} from '../store';

type Props = {
  navigation: NavigationProp<any>;
};

export const EventDetailsScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const route = useRoute<any>();
  const idFromParams = route?.params?.id as string | undefined;

  const {data, isLoading, error} = useEventDetails(idFromParams);

  const eventId: string | undefined = idFromParams || data?.id;

  const toggleFavorite = useStore((s: any) => s.toggleFavorite);
  const isFav = useStore((s: any) => !!(eventId && s.favorites?.[eventId]));

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
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
        <AppText>{t('event.not_found')}</AppText>
      </View>
    );
  }

  const img = data?.images?.[0]?.url as string | undefined;
  const venue = data?._embedded?.venues?.[0];
  const cityName = venue?.city?.name;
  const venueName = venue?.name;
  const dateTime = data?.dates?.start?.dateTime;
  const tmUrl = data?.url;
  let formattedDate: string | undefined = dateTime;
  try {
    if (dateTime) formattedDate = new Date(dateTime).toLocaleString();
  } catch {}

  const latRaw = venue?.location?.latitude;
  const lngRaw = venue?.location?.longitude;
  const lat = typeof latRaw === 'number' ? latRaw : Number(latRaw);
  const lng = typeof lngRaw === 'number' ? lngRaw : Number(lngRaw);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  const onOpenTicketmaster = () => {
    if (tmUrl) Linking.openURL(tmUrl);
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${data?.name}${tmUrl ? ` · ${tmUrl}` : ''}`,
      });
    } catch {}
  };

  const onToggleFav = () => {
    if (!eventId) return;
    toggleFavorite?.(data);
  };

  return (
    <ScrollView contentContainerStyle={{paddingBottom: scale(24)}}>
      <View style={styles.imageWrap}>
        {img ? (
          <Image source={{uri: img}} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={styles.topbar}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}>
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

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onToggleFav}
              accessibilityLabel={
                isFav ? t('favorites.remove') : t('favorites.add')
              }>
              <VectorIcon
                type="Ionicons"
                name={isFav ? 'heart' : 'heart-outline'}
                size={scale(18)}
                color={isFav ? '#FF4667' : colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <AppText style={styles.title}>{data?.name}</AppText>

        {(cityName || venueName) && (
          <AppText style={styles.subtitle}>
            {cityName}
            {venueName ? ` • ${venueName}` : ''}
          </AppText>
        )}

        {!!formattedDate && (
          <InfoRow icon="calendar-outline" text={formattedDate} />
        )}

        {(cityName || venueName) && (
          <InfoRow
            icon="location-outline"
            text={`${cityName || ''}${venueName ? ` • ${venueName}` : ''}`}
          />
        )}

        {Array.isArray(data?.priceRanges) && data.priceRanges.length > 0 && (
          <InfoRow
            icon="pricetag-outline"
            text={`${data.priceRanges[0].min ?? ''} - ${
              data.priceRanges[0].max ?? ''
            } ${data.priceRanges[0].currency ?? ''}`}
          />
        )}

        {Array.isArray(data?.classifications) &&
          data.classifications.length > 0 && (
            <View style={styles.chipsWrap}>
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
                {t('event.open_ticketmaster')}
              </AppText>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.goBack()}>
            <VectorIcon
              type="Ionicons"
              name="arrow-undo-outline"
              size={scale(16)}
              color={colors.primary}
            />
            <AppText style={styles.secondaryBtnText}>{t('event.back')}</AppText>
          </TouchableOpacity>
        </View>
      </View>
      {hasCoords ? (
        <View style={{marginHorizontal: scale(16), marginTop: scale(8)}}>
          <EventMap
            lat={lat}
            lng={lng}
            title={data?.name}
            subtitle={
              [venueName, cityName].filter(Boolean).join(' • ') || undefined
            }
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

function InfoRow({icon, text}: {icon: string; text: string}) {
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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(6),
    marginTop: scale(8),
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
  actionsRow: {flexDirection: 'row', gap: scale(10), marginTop: scale(12)},
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
