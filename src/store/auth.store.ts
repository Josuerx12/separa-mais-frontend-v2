import { create } from "zustand";
import { AuthService } from "../services/auth.service";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: {
    id: string;
    name: string;
    slug: string;
  };
  permissions: {
    isOwner: true;
    isAdmin: true;
    isRequester: true;
    isAlmoxarife: true;
  };
}

export interface IAuth {
  isAuthenticated: boolean;
  isUserLoading: boolean;
  user?: IUser | null;
  refreshToken: () => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<IAuth>((set) => ({
  isAuthenticated: false,
  isUserLoading: true,
  signIn: async ({ email, password }) => {
    try {
      await AuthService.login({ email, password });

      const res = await AuthService.getMe();

      set({ user: res, isAuthenticated: true });
    } catch (error) {
      set({ isAuthenticated: false, user: null });
    }
  },
  refreshToken: async () => {
    set({ isUserLoading: true });

    try {
      await AuthService.refreshToken();

      const res = await AuthService.getMe();

      set({ user: res, isAuthenticated: true });
    } catch (error) {
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isUserLoading: false });
    }
  },
  signOut: () => {
    AuthService.signOut();

    set({ isAuthenticated: false, isUserLoading: false });
  },
}));
