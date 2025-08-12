import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
  DefaultTheme,
} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MainNavigator} from './navigation';
import {colors} from './config/theme';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

interface AppProps {}

export const navigationRef = createNavigationContainerRef<any>();

const Mytheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    text: 'rgb(28, 28, 30)',
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: true,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
  },
});

const App = (props: AppProps) => {
  const isReadyRef = React.useRef<boolean>(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <GestureHandlerRootView style={styles.container}>
          <NavigationContainer
            theme={Mytheme}
            ref={navigationRef}
            onReady={() => {
              isReadyRef.current = true;
            }}>
            <KeyboardAvoidingView
              style={[styles.container]}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <MainNavigator />
            </KeyboardAvoidingView>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
