export interface StoreSchema {
  user?: {id: string; name: string; email: string} | any | null;
  token?: string | null;
  loadingAuth?: boolean;
}

export interface StoreSetters {
  saveUser: (user: any | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const schema: StoreSchema = {
  user: null,
  token: null,
  loadingAuth: false,
};
