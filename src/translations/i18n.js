import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import {storage} from '../utils';

let resources = {
  en: {translation: require('./en.json')},
  ar: {translation: require('./ar.json')},
};
export function initLang() {
  return i18n.use(initReactI18next).init({
    lng: I18nManager.isRTL ? 'ar' : 'en',
    compatibilityJSON: 'v3',
    resources,
    ignoreJSONStructure: true,
    interpolation: {
      escapeValue: false,
    },
  });
}

export const changeLng = async (lang, flag) => {
  storage.set('language', lang);

  i18n.changeLanguage(lang);

  if (lang === 'ar') {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
  } else if (lang === 'en') {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
  }

  if (flag) {
    RNRestart.Restart();
  }
};

export const CurrentLanguage = () => {
  let language = storage.getString('language');
  return language;
};
