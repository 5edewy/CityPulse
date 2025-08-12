import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {CurrentLanguage, changeLng, Lang} from './index';
import {colors, scale, normalizeFontSize} from '../config/theme';
import {AppText, VectorIcon} from '../components/common';

export const LanguageIconToggle = () => {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(CurrentLanguage());
  }, []);

  const onToggle = async () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    await changeLng(next, true);
  };

  const isArabic = lang === 'ar';

  return (
    <TouchableOpacity
      style={styles.pill}
      onPress={onToggle}
      activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <VectorIcon
          type="Ionicons"
          name="globe-outline"
          size={scale(16)}
          color={colors.primary}
        />
      </View>
      <AppText style={styles.label}>{isArabic ? 'AR' : 'EN'}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    height: scale(36),
    paddingHorizontal: scale(12),
    borderRadius: scale(18),
    borderWidth: scale(1),
    borderColor: colors.grayTransparent5,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    alignSelf: 'flex-start',
  },
  iconWrap: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    backgroundColor: colors.hoverBackcolor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: normalizeFontSize(12),
    color: colors.black,
    fontWeight: '700',
  },
});
