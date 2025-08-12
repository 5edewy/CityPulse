import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useStore} from '../store';
import screenNames from '../navigation/screenNames';
import {NavigationProp} from '@react-navigation/native';

import {AppText} from '../components/common/AppText';
import {AppTextInput} from '../components/common/AppTextInput';
import {VectorIcon} from '../components/common/VectorIcon';
import {colors, scale, normalizeFontSize, renderError} from '../config/theme';
import {AppButton} from '../components/common';
import {useTranslation} from 'react-i18next';

type Props = {
  navigation: NavigationProp<any>;
};

export const LoginScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const login = useStore(s => s.login);
  const loading = useStore(s => s.loadingAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      renderError(t('auth.email_password_required'));
      return;
    }
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      renderError(e?.message || t('common.unknown_error'));
      console.warn('Login failed:', e?.message || e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}>
      <View style={styles.card}>
        <AppText style={styles.title}>{t('welcome_back')} 👋</AppText>
        <AppText style={styles.subtitle}>{t('auth.sign_in_subtitle')}</AppText>
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
        <AppButton textBtn={t('login')} onPress={onSubmit} loading={loading} />

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate(screenNames.SIGNUP)}>
          <AppText style={styles.linkText}>
            {t('auth.no_account')}{' '}
            <AppText style={styles.linkTextBold}>{t('auth.signup')}</AppText>
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
