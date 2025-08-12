// src/screens/Auth/LoginScreen.tsx
import React, {useState} from 'react';
import {
  View,
  ActivityIndicator,
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

// ⬇️ لو عندك AppButton عالمي، فعِّل السطر ده واستبدل الزر المحلي في آخر الشاشة
// import {AppButton} from '../components/common/AppButton';

type Props = {
  navigation: NavigationProp<any>;
};

export const LoginScreen = ({navigation}: Props) => {
  const login = useStore(s => s.login);
  const loading = useStore(s => s.loadingAuth);

  const [email, setEmail] = useState('test@demo.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      // استخدم ريندر الخطأ بتاعك لو حابب
      renderError('Email & Password are required');
      return;
    }
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      renderError(e?.message || 'Unknown error');
      console.warn('Login failed:', e?.message || e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}>
      <View style={styles.card}>
        {/* Header */}
        <AppText style={styles.title}>Welcome back 👋</AppText>
        <AppText style={styles.subtitle}>Sign in to City Pulse</AppText>

        {/* Email */}
        <AppText style={styles.label}>Email</AppText>
        <AppTextInput
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          appearIcon={false} // هنستخدم أيقونة يمين بدل صورة يسار
          returnKeyType="next">
          <VectorIcon
            type="Ionicons"
            name="mail-outline"
            size={scale(16)}
            color={colors.warmGrey}
            style={{marginRight: scale(6)}}
          />
        </AppTextInput>

        {/* Password */}
        <AppText style={styles.label}>Password</AppText>
        <AppTextInput
          placeholder="••••••••"
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

        {/* Actions */}
        <View style={{height: scale(8)}} />

        <AppButton textBtn="Login" onPress={onSubmit} loading={loading} />

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate(screenNames.SIGNUP)}>
          <AppText style={styles.linkText}>
            Don’t have an account?{' '}
            <AppText style={styles.linkTextBold}>Sign up</AppText>
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
  primaryBtn: {
    height: scale(44),
    borderRadius: scale(10),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(6),
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: normalizeFontSize(13.5),
    fontWeight: '700',
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
  loadingBtn: {
    height: scale(44),
    borderRadius: scale(10),
    backgroundColor: colors.grayTransparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(6),
  },
});
