import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { authApi } from '@/api';

interface AuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (username: string, password: string): Promise<boolean> => {
        try {
          console.log('Starting login process for:', username);
          set({ isLoading: true, error: null });

          const response = await authApi.login({ username, password });
          console.log('Login API response received:', response);

          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            image: response.image,
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            
            document.cookie = `authToken=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            console.log('Token saved to localStorage and cookies');
          }

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('Login successful, user authenticated');
          return true;
        } catch (error: unknown) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message || 'Authorization error';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      logout: () => {
        console.log('Logging out user');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          console.log('Cleared tokens and cookies');
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        
        console.log('Logout completed');
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: async () => {
        if (typeof window === 'undefined') {
          return;
        }
        
        console.log('Initializing auth...');
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('auth-storage');
        
        console.log('📋 Auth data check:', { 
          hasToken: !!token, 
          hasStoredData: !!userString,
          tokenPreview: token ? token.substring(0, 20) + '...' : null
        });
        
        if (!token) {
          console.log('No token found, clearing auth');
          set({ isLoading: false, isAuthenticated: false, user: null, token: null });
          return;
        }

        if (!userString) {
          console.log('No stored user data found, clearing auth');
          get().logout();
          set({ isLoading: false });
          return;
        }

        try {
          const userData = JSON.parse(userString);
          const user = userData?.state?.user;
          
          console.log('Stored user data:', { 
            hasUser: !!user, 
            username: user?.username 
          });
          
          if (user && token) {
            document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            console.log('Auth initialized successfully for:', user.username);
          } else {
            console.log('Invalid stored data, clearing auth');
            get().logout();
            set({ isLoading: false });
          }
        } catch (error) {
          console.log('Auth initialization failed:', error);
          get().logout();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);