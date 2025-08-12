// src/screens/HomeScreen.tsx
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import screenNames from '../navigation/screenNames';

import {useSearchEventsInfinite} from '../hooks/useSearchEventsInfinite';
import {AppText} from '../components/common/AppText';
import {AppTextInput} from '../components/common/AppTextInput';
import {VectorIcon} from '../components/common/VectorIcon';
import {colors, scale, normalizeFontSize} from '../config/theme';

type Props = {navigation: NavigationProp<any>};

const PAGE_SIZE = 20;

export const HomeScreen = ({navigation}: Props) => {
  const listRef = useRef<FlatList>(null);

  // local inputs
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');

  // committed values for fetching
  const [qKeyword, setQKeyword] = useState('');
  const [qCity, setQCity] = useState('');

  // search panel visibility
  const [showSearch, setShowSearch] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    refetch,
  } = useSearchEventsInfinite(qKeyword, qCity, PAGE_SIZE);

  // flatten events + unique keys (avoid duplicate keys)
  console.log('data', data);

  const {items, totalPages, currentPage, totalElements} = useMemo(() => {
    const pages = data?.pages ?? [];
    const flat = pages.flatMap((p, idx) => {
      const pageNum = p?.page?.number ?? idx;
      const evs = p?._embedded?.events ?? [];
      return evs.map((e: any) => ({
        ...e,
        __k: `${e?.id || 'NA'}-${pageNum}`, // unique per page
      }));
    });
    const last = pages[pages.length - 1];
    return {
      items: flat,
      totalPages: last?.page?.totalPages ?? 0,
      currentPage: (last?.page?.number ?? -1) + 1 || 0,
      totalElements: last?.page?.totalElements ?? flat.length,
    };
  }, [data]);

  // auto-hide search when results appear; keep it if no results
  useEffect(() => {
    if ((qKeyword || qCity) && items.length > 0) {
      setShowSearch(false);
    }
  }, [items.length, qKeyword, qCity]);

  const onSearch = () => {
    setQKeyword(keyword.trim());
    setQCity(city.trim());
    // if user hits search and there are previous results, collapse now
    if (items.length > 0) setShowSearch(false);
    refetch();
    // scroll to top for fresh context
    requestAnimationFrame(() =>
      listRef.current?.scrollToOffset({offset: 0, animated: true}),
    );
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate(screenNames.EVENT_DETAILS, {id: item.id})
      }>
      {item?.images?.[0]?.url ? (
        <Image source={{uri: item.images[0].url}} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]} />
      )}

      <View style={styles.cardBody}>
        <AppText numberOfLines={1} style={styles.cardTitle}>
          {item?.name}
        </AppText>
        <AppText numberOfLines={1} style={styles.cardSub}>
          {item?._embedded?.venues?.[0]?.city?.name}
          {item?._embedded?.venues?.[0]?.name
            ? ` • ${item._embedded.venues[0].name}`
            : ''}
        </AppText>
        {!!item?.dates?.start?.dateTime && (
          <AppText numberOfLines={1} style={styles.cardMeta}>
            {item.dates.start.dateTime}
          </AppText>
        )}
      </View>

      <VectorIcon
        type="Ionicons"
        name="chevron-forward"
        size={scale(18)}
        color={colors.approxNobalGray}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Search card — shown if toggled on, or if no results yet */}
      {(showSearch || items.length === 0) && (
        <View style={styles.searchCard}>
          <AppText style={styles.title}>City Pulse</AppText>
          <AppText style={styles.subtitle}>
            Find local events by keyword & city
          </AppText>

          <AppText style={styles.label}>Keyword</AppText>
          <AppTextInput
            placeholder="e.g., music, sports, comedy"
            value={keyword}
            onChangeText={setKeyword}
            autoCapitalize="none"
            autoCorrect={false}
            appearIcon={false}
            returnKeyType="search"
            onSubmitEditing={onSearch}>
            {keyword?.length ? (
              <TouchableOpacity
                onPress={() => setKeyword('')}
                style={{marginRight: scale(6)}}>
                <VectorIcon
                  type="Ionicons"
                  name="close-circle-outline"
                  size={scale(16)}
                  color={colors.warmGrey}
                />
              </TouchableOpacity>
            ) : (
              <VectorIcon
                type="Ionicons"
                name="search-outline"
                size={scale(16)}
                color={colors.warmGrey}
                style={{marginRight: scale(6)}}
              />
            )}
          </AppTextInput>

          <AppText style={styles.label}>City</AppText>
          <AppTextInput
            placeholder="e.g., Dubai, London, New York"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
            appearIcon={false}
            returnKeyType="search"
            onSubmitEditing={onSearch}>
            {city?.length ? (
              <TouchableOpacity
                onPress={() => setCity('')}
                style={{marginRight: scale(6)}}>
                <VectorIcon
                  type="Ionicons"
                  name="close-circle-outline"
                  size={scale(16)}
                  color={colors.warmGrey}
                />
              </TouchableOpacity>
            ) : (
              <VectorIcon
                type="Ionicons"
                name="location-outline"
                size={scale(18)}
                color={colors.warmGrey}
                style={{marginRight: scale(6)}}
              />
            )}
          </AppTextInput>

          <TouchableOpacity style={styles.primaryBtn} onPress={onSearch}>
            <AppText style={styles.primaryBtnText}>Search</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Meta row + "Refine" chip (to reopen search anytime) */}
      <View style={styles.metaRow}>
        <AppText style={styles.metaText}>
          {qKeyword || qCity
            ? `Showing ${items.length}${
                totalElements ? ` of ${totalElements}` : ''
              }`
            : 'Type a keyword/city to search'}
        </AppText>
        <View
          style={{flexDirection: 'row', alignItems: 'center', gap: scale(8)}}>
          {totalPages ? (
            <AppText style={styles.metaText}>
              Page {currentPage} / {totalPages}
            </AppText>
          ) : null}
          {items.length > 0 && !showSearch && (
            <TouchableOpacity
              onPress={() => {
                setShowSearch(true);
                requestAnimationFrame(() =>
                  listRef.current?.scrollToOffset({offset: 0, animated: true}),
                );
              }}
              style={styles.refineChip}
              activeOpacity={0.9}>
              <VectorIcon
                type="Ionicons"
                name="options-outline"
                size={scale(14)}
                color={colors.primary}
              />
              <AppText style={styles.refineText}>Refine</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(it: any, idx) => String(it?.__k ?? it?.id ?? idx)}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: scale(90)}}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <AppText style={styles.emptyText}>No results</AppText>
          ) : null
        }
        ListFooterComponent={
          isLoading || isFetching ? (
            <View style={{paddingVertical: scale(10), alignItems: 'center'}}>
              <ActivityIndicator />
            </View>
          ) : isFetchingNextPage ? (
            <View style={{paddingVertical: scale(10), alignItems: 'center'}}>
              <ActivityIndicator />
              <AppText style={{marginTop: scale(6)}}>Loading more…</AppText>
            </View>
          ) : hasNextPage ? (
            <TouchableOpacity
              onPress={() => fetchNextPage()}
              style={styles.loadMoreBtn}
              activeOpacity={0.85}>
              <AppText style={styles.loadMoreText}>Load more</AppText>
              <VectorIcon
                type="Ionicons"
                name="chevron-down"
                size={scale(16)}
                color={colors.primary}
              />
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Floating Search FAB (also reopens search) */}
      {items.length > 0 && !showSearch && (
        <TouchableOpacity
          onPress={() => {
            setShowSearch(true);
            requestAnimationFrame(() =>
              listRef.current?.scrollToOffset({offset: 0, animated: true}),
            );
          }}
          style={styles.fab}
          activeOpacity={0.9}
          accessibilityLabel="Open search">
          <VectorIcon
            type="Ionicons"
            name="search"
            size={scale(20)}
            color={colors.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.mainbgLightBlue},

  searchCard: {
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
    marginBottom: scale(10),
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
  label: {
    marginTop: scale(8),
    marginBottom: scale(6),
    fontSize: normalizeFontSize(11.5),
    color: colors.lightBlack,
  },
  primaryBtn: {
    height: scale(42),
    borderRadius: scale(10),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(8),
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: normalizeFontSize(13.5),
    fontWeight: '700',
  },

  metaRow: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    color: colors.lightBlack,
    fontSize: normalizeFontSize(11),
  },
  refineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: colors.white,
    borderWidth: scale(1),
    borderColor: colors.primary,
  },
  refineText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: normalizeFontSize(11),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: scale(8),
    backgroundColor: colors.backgroundGray,
    borderRadius: scale(12),
    borderWidth: scale(0.5),
    borderColor: colors.grayTransparent5,
    marginHorizontal: scale(16),
    marginBottom: scale(8),
  },
  thumb: {width: scale(64), height: scale(64), borderRadius: scale(8)},
  thumbPlaceholder: {backgroundColor: colors.grayTransparent9},
  cardBody: {flex: 1},
  cardTitle: {
    fontSize: normalizeFontSize(13.5),
    fontWeight: '700',
    color: colors.blackText,
  },
  cardSub: {
    marginTop: scale(2),
    fontSize: normalizeFontSize(11.5),
    color: colors.sonicSilverGray,
  },
  cardMeta: {
    marginTop: scale(2),
    fontSize: normalizeFontSize(10.5),
    color: colors.grey94,
  },

  loadMoreBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(14),
    paddingVertical: scale(8),
    backgroundColor: colors.white,
    borderRadius: scale(18),
    borderWidth: scale(1),
    borderColor: colors.primary,
    marginTop: scale(6),
    marginBottom: scale(12),
  },
  loadMoreText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: normalizeFontSize(11.5),
  },

  emptyText: {
    textAlign: 'center',
    marginTop: scale(24),
    color: colors.sonicSilverGray,
    fontSize: normalizeFontSize(11.5),
  },

  fab: {
    position: 'absolute',
    right: scale(16),
    bottom: scale(16),
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
});
