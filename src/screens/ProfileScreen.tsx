import React, {useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useStore} from '../store';
import {AppText} from '../components/common/AppText';
import {VectorIcon} from '../components/common/VectorIcon';
import {colors, scale, normalizeFontSize} from '../config/theme';
import screenNames from '../navigation/screenNames';
import {LanguageIconToggle} from '../translations';

type Props = {navigation: NavigationProp<any>};

export const ProfileScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);

  const initial = useMemo(
    () => (user?.name?.[0] || user?.email?.[0] || '?').toUpperCase(),
    [user],
  );

  const onLogout = async () => {
    await logout?.();
    navigation.reset({index: 0, routes: [{name: screenNames.LOGIN}]});
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.mainbgLightBlue}}>
      <View style={styles.header}>
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
        <AppText style={styles.headerTitle}>{t('profile.title')}</AppText>
        <View style={{width: scale(36)}} />
      </View>

      <View style={{paddingHorizontal: scale(16), paddingBottom: scale(16)}}>
        <View style={styles.card}>
          <View style={styles.avatarCircle}>
            <AppText style={styles.avatarInitial}>{initial}</AppText>
          </View>

          <AppText style={styles.nameText} numberOfLines={1}>
            {user?.name || t('auth.name_label')}
          </AppText>
          <AppText style={styles.captionText} numberOfLines={1}>
            {user?.email || t('profile.email')}
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>
            {t('profile.account', {defaultValue: 'Account'})}
          </AppText>

          <Row
            icon="person-outline"
            label={t('auth.name_label')}
            value={user?.name || '-'}
          />
          <Row
            icon="mail-outline"
            label={t('profile.email')}
            value={user?.email || '-'}
          />
          <Row
            icon="id-card-outline"
            label={t('profile.user_id', {defaultValue: 'User ID'})}
            value={user?.id || '-'}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.inlineRow}>
            <AppText style={styles.sectionTitleInline}>
              {t('profile.language')}
            </AppText>
            <LanguageIconToggle />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <VectorIcon
            type="Ionicons"
            name="log-out-outline"
            size={scale(16)}
            color={colors.white}
          />
          <AppText style={styles.logoutText}>{t('profile.logout')}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function Row({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <VectorIcon
          type="Ionicons"
          name={icon as any}
          size={scale(16)}
          color={colors.primary}
        />
      </View>
      <View style={{flex: 1}}>
        <AppText style={styles.rowLabel}>{label}</AppText>
        <AppText style={styles.rowValue} numberOfLines={1}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: scale(56),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.mainbgLightBlue,
  },
  iconBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.blackTrasparent6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.black,
    fontWeight: '700',
    fontSize: normalizeFontSize(16),
  },

  card: {
    backgroundColor: colors.backgroundGray,
    borderRadius: scale(14),
    padding: scale(14),
    borderWidth: scale(0.5),
    borderColor: colors.grayTransparent5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
    marginTop: scale(12),
    alignItems: 'center',
  },
  avatarCircle: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayTransparent9,
    marginBottom: scale(8),
  },
  avatarInitial: {
    color: colors.black,
    fontSize: normalizeFontSize(24),
    fontWeight: '700',
  },
  nameText: {
    fontSize: normalizeFontSize(16),
    fontWeight: '700',
    color: colors.black,
  },
  captionText: {
    marginTop: scale(2),
    fontSize: normalizeFontSize(11.5),
    color: colors.sonicSilverGray,
  },

  sectionTitle: {
    alignSelf: 'flex-start',
    fontWeight: '700',
    color: colors.black,
    fontSize: normalizeFontSize(13.5),
    marginBottom: scale(8),
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: scale(8),
    borderTopWidth: scale(0.5),
    borderTopColor: colors.grayTransparent5,
  },
  rowIcon: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1),
    borderColor: colors.grayTransparent5,
  },
  rowLabel: {
    color: colors.sonicSilverGray,
    fontSize: normalizeFontSize(10.5),
  },
  rowValue: {
    color: colors.black,
    fontSize: normalizeFontSize(12.5),
    fontWeight: '600',
  },

  logoutBtn: {
    marginTop: scale(16),
    height: scale(44),
    borderRadius: scale(10),
    backgroundColor: colors.redTomato,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(6),
  },
  logoutText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: normalizeFontSize(12.5),
  },
  inlineRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleInline: {
    color: colors.black,
    fontWeight: '700',
    fontSize: normalizeFontSize(13.5),
  },
});
