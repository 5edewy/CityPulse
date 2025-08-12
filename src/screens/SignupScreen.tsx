import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {useStore} from '../store';
import screenNames from '../navigation/screenNames';

import {AppText} from '../components/common/AppText';
import {AppTextInput} from '../components/common/AppTextInput';
import {VectorIcon} from '../components/common/VectorIcon';
import {colors, scale, normalizeFontSize, renderError} from '../config/theme';
import {AppButton} from '../components/common';
import {useTranslation} from 'react-i18next';

type Props = {
  navigation: NavigationProp<any>;
};

export const SignupScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const signup = useStore(s => s.signup);
  const loading = useStore(s => s.loadingAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    if (!name?.trim() || !email?.trim() || !password) {
      renderError(t('auth.all_fields_required'));
      return;
    }
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (e: any) {
      renderError(e?.message || t('common.unknown_error'));
      console.warn('Signup failed:', e?.message || e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}>
      <View style={styles.card}>
        <AppText style={styles.title}>{t('auth.create_account_title')}</AppText>
        <AppText style={styles.subtitle}>{t('auth.join_subtitle')}</AppText>

        <AppText style={styles.label}>{t('auth.name_label')}</AppText>
        <AppTextInput
          placeholder={t('auth.name_placeholder')}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          appearIcon={false}
          returnKeyType="next">
          <VectorIcon
            type="Ionicons"
            name="person-outline"
            size={scale(16)}
            color={colors.warmGrey}
            style={{marginRight: scale(6)}}
          />
        </AppTextInput>

        <AppText style={styles.label}>{t('auth.email_label')}</AppText>
        <AppTextInput
          placeholder={t('auth.email_placeholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          appearIcon={false}
          returnKeyType="next">
          <VectorIcon
            type="Ionicons"
            name="mail-outline"
            size={scale(16)}
            color={colors.warmGrey}
            style={{marginRight: scale(6)}}
          />
        </AppTextInput>

        <AppText style={styles.label}>{t('auth.password_label')}</AppText>
        <AppTextInput
          placeholder={t('auth.password_placeholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          appearIcon={false}
          returnKeyType="done"
          onSubmitEditing={onSubmit}>
          <TouchableOpacity onPress={() => setShowPassword(s => !s)}>
            <VectorIcon
              type="Ionicons"
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={scale(18)}
              color={colors.warmGrey}
              style={{marginRight: scale(6)}}
            />
          </TouchableOpacity>
        </AppTextInput>

        <View style={{height: scale(8)}} />
        <AppButton
          textBtn={t('auth.create')}
          onPress={onSubmit}
          loading={loading}
        />

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate(screenNames.LOGIN)}>
          <AppText style={styles.linkText}>
            {t('auth.already_have_account')}{' '}
            <AppText style={styles.linkTextBold}>{t('login')}</AppText>
          </AppText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.mainbgLightBlue,
    padding: scale(16),
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
  },
  title: {
    fontSize: normalizeFontSize(18),
    color: colors.black,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: scale(4),
    marginBottom: scale(14),
    fontSize: normalizeFontSize(12.5),
    color: colors.sonicSilverGray,
  },
  label: {
    marginTop: scale(10),
    marginBottom: scale(6),
    fontSize: normalizeFontSize(11.5),
    color: colors.lightBlack,
  },
  linkBtn: {
    alignSelf: 'center',
    paddingVertical: scale(10),
  },
  linkText: {
    color: colors.sonicSilverGray,
    fontSize: normalizeFontSize(11.5),
  },
  linkTextBold: {
    color: colors.primary,
    fontWeight: '700',
  },
});
