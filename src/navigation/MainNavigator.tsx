import React, {memo} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {colors, isIOS, normalizeFontSize} from '../config/theme';
import screenNames from './screenNames';

import {
  LoginScreen,
  HomeScreen,
  SignupScreen,
  EventDetailsScreen,
  ProfileScreen,
} from '../screens';
import {useStore} from '../store';
import {useTranslation} from 'react-i18next';

type RootStackParamList = {};

const {HOME, LOGIN, SIGNUP, EVENT_DETAILS, PROFILE} = screenNames;
export const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = memo(() => {
  const user = useStore(s => s.user);
  const {t} = useTranslation();

  const stackOptions: NativeStackNavigationOptions = {
    headerBackTitle: '',
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerTitleStyle: {
      fontSize: normalizeFontSize(17),
    },
    headerBackButtonDisplayMode: 'minimal',
    animation: 'slide_from_left',
    statusBarTranslucent: false,
    statusBarBackgroundColor: colors.white,
    ...(!isIOS && {statusBarStyle: 'dark'}),
  };
  return (
    <>
      {user ? (
        <Stack.Navigator
          screenOptions={stackOptions}
          initialRouteName={HOME as keyof undefined}>
          <Stack.Screen
            name={HOME as keyof undefined}
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name={EVENT_DETAILS as keyof undefined}
            component={EventDetailsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={PROFILE as keyof undefined}
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={stackOptions}>
          <Stack.Screen
            name={LOGIN as keyof undefined}
            component={LoginScreen}
            options={{
              title: t('login'),
              headerTransparent: true,
            }}
          />

          <Stack.Screen
            name={SIGNUP as keyof undefined}
            component={SignupScreen}
            options={{
              title: t('auth.signup'),
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
});
