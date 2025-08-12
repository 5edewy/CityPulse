import {FavoriteEvent, StoreSchema, StoreSetters} from './storeTypes';
import {mockLogin, mockSignup} from '../utils';

const extractEventSummary = (eventRaw: any): FavoriteEvent | null => {
  const id = eventRaw?.id;
  if (!id) return null;
  const image = eventRaw?.images?.[0]?.url;
  const venue = eventRaw?._embedded?.venues?.[0];

  return {
    id,
    name: eventRaw?.name,
    image,
    city: venue?.city?.name,
    venue: venue?.name,
    dateTime: eventRaw?.dates?.start?.dateTime,
    raw: eventRaw,
  };
};

const setters: (
  set: (param: Partial<StoreSchema>) => void,
  get: () => StoreSchema,
) => StoreSetters = (set, get) => ({
  saveUser: (user: any | null) => {
    set({user, token: user ? get().token ?? null : null});
  },

  async login(email: string, password: string) {
    set({loadingAuth: true});
    try {
      const {user, token} = await mockLogin(email.trim(), password);
      set({user, token, loadingAuth: false});
    } catch (e) {
      set({loadingAuth: false});
      throw e;
    }
  },

  async signup(name: string, email: string, password: string) {
    set({loadingAuth: true});
    try {
      const {user, token} = await mockSignup(
        name.trim(),
        email.trim(),
        password,
      );
      set({user, token, loadingAuth: false});
    } catch (e) {
      set({loadingAuth: false});
      throw e;
    }
  },

  async logout() {
    set({user: null, token: null});
  },

  toggleFavorite: (eventRaw: any) => {
    const summary = extractEventSummary(eventRaw);
    if (!summary) return;
    const current = get().favorites || {};
    const exists = !!current[summary.id];
    const next = {...current};
    if (exists) {
      delete next[summary.id];
    } else {
      next[summary.id] = summary;
    }
    set({favorites: next});
  },

  removeFavorite: (id: string) => {
    if (!id) return;
    const current = get().favorites || {};
    if (!current[id]) return;
    const next = {...current};
    delete next[id];
    set({favorites: next});
  },

  isFavorite: (id?: string) => {
    if (!id) return false;
    const current = get().favorites || {};
    return !!current[id];
  },
});

export default setters;
