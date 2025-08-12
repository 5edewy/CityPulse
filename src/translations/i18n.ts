import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import {storage} from '../store';

export type Lang = 'en' | 'ar';

const resources = {
  en: {translation: require('./en.json')},
  ar: {translation: require('./ar.json')},
} as const;

const getSavedLang = (): Lang => {
  const saved = storage.getString('language');
  return saved === 'ar' ? 'ar' : 'en';
};

export async function initLang(): Promise<void> {
  const lang = getSavedLang();
  const shouldRTL = lang === 'ar';

  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);
  }

  await i18n.use(initReactI18next).init({
    lng: lang,
    fallbackLng: 'en',
    resources,
    compatibilityJSON: 'v3',
    ignoreJSONStructure: true,
    interpolation: {escapeValue: false},
  });

  storage.set('language', lang);
}

export const changeLng = async (lang: Lang, restart = true): Promise<void> => {
  storage.set('language', lang);
  await i18n.changeLanguage(lang);

  const shouldRTL = lang === 'ar';
  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);
  }

  if (restart) RNRestart.Restart();
};

export const CurrentLanguage = (): Lang => getSavedLang();

export default i18n;
