import Config from 'react-native-config';
export * from './routes';
export * from './constants';

export const configVars = {
  BASE_URL: Config.BASE_URL,
  TM_API_KEY: Config.TM_API_KEY,
};
