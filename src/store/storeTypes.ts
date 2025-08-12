export interface FavoriteEvent {
  id: string;
  name?: string;
  image?: string;
  city?: string;
  venue?: string;
  dateTime?: string;
  raw?: any; // بنخزن الـ RAW لو حبيت تستخدمه لاحقاً
}

export interface StoreSchema {
  user?: {id: string; name: string; email: string} | any | null;
  token?: string | null;
  loadingAuth?: boolean;
  favorites?: Record<string, FavoriteEvent>;
}

export interface StoreSetters {
  saveUser: (user: any | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (eventRaw: any) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id?: string) => boolean;
}

export const schema: StoreSchema = {
  user: null,
  token: null,
  loadingAuth: false,
  favorites: {},
};
