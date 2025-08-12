import {StoreSchema, StoreSetters} from './storeTypes';
import {mockLogin, mockSignup} from '../utils';

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
});

export default setters;
