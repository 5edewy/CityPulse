// src/screens/Auth/SignupScreen.tsx
import React, {useState} from 'react';
import {
  View,
  ActivityIndicator,
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
import {colors, scale, normalizeFontSize} from '../config/theme';
import {AppButton} from '../components/common';

// If you have a global button, use it here:
// import {AppButton} from '../components/common/AppButton';

type Props = {
  navigation: NavigationProp<any>;
};

export const SignupScreen = ({navigation}: Props) => {
  const signup = useStore(s => s.signup);
  const loading = useStore(s => s.loadingAuth);

  const [name, setName] = useState('User');
  const [email, setEmail] = useState('new@demo.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    if (!name?.trim() || !email?.trim() || !password) {
      // renderError('All fields required');
      return;
    }
    try {
      await signup(name.trim(), email.trim(), password);
      // optionally: navigation.replace(screenNames.HOME);
    } catch (e: any) {
      console.warn('Signup failed:', e?.message || e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}>
      <View style={styles.card}>
        <AppText style={styles.title}>Create account</AppText>
        <AppText style={styles.subtitle}>Join City Pulse in seconds</AppText>

        {/* Name */}
        <AppText style={styles.label}>Name</AppText>
        <AppTextInput
          placeholder="Your name"
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

        {/* Email */}
        <AppText style={styles.label}>Email</AppText>
        <AppTextInput
          placeholder="your@email.com"
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

        <View style={{height: scale(8)}} />

        <AppButton
          textBtn="Create account"
          onPress={onSubmit}
          loading={loading}
        />

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate(screenNames.LOGIN)}>
          <AppText style={styles.linkText}>
            Already have an account?{' '}
            <AppText style={styles.linkTextBold}>Log in</AppText>
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
