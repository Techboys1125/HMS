import { useSyncExternalStore } from "react";
import type { User, AuthTokens, AuthState } from "../types/auth.types";
import {
  getToken,
  setToken,
  removeToken,
} from "../../../lib/cookie-token-storage";

const STORAGE_KEY = "hms-auth-storage:v1";

function loadInitialState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user && parsed.tokens) {
        return {
          user: parsed.user,
          tokens: parsed.tokens,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      }
    }
  } catch (e) {
    console.error("Failed to load auth state from localStorage:", e);
  }

  // Fallback to individual localStorage items if available
  const accessToken = getToken("accessToken");
  const refreshToken = getToken("refreshToken");
  const storedUserRaw = localStorage.getItem("hms-user:v1");

  if (accessToken && refreshToken && storedUserRaw) {
    try {
      const user = JSON.parse(storedUserRaw);
      return {
        user,
        tokens: {
          accessToken,
          refreshToken,
          tokenType: "Bearer",
          expiresIn: 86400,
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    } catch (e) {
      console.error("Failed to parse stored user:", e);
    }
  }

  return {
    user: null,
    tokens: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
}

let currentState: AuthState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function sanitizeUserForStorage(user: User): User {
  const copy = { ...user };
  if (copy.photoUrl && copy.photoUrl.startsWith("data:image")) {
    copy.photoUrl = "";
  }
  if (copy.photo && copy.photo.startsWith("data:image")) {
    copy.photo = "";
  }
  return copy;
}

function saveState(state: AuthState) {
  try {
    if (state.isAuthenticated && state.user && state.tokens) {
      const sanitizedUser = sanitizeUserForStorage(state.user);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: sanitizedUser, tokens: state.tokens }),
      );
      localStorage.setItem("hms-user:v1", JSON.stringify(sanitizedUser));
      setToken("accessToken", state.tokens.accessToken);
      setToken("refreshToken", state.tokens.refreshToken);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("hms-user:v1");
      removeToken("accessToken");
      removeToken("refreshToken");
    }
  } catch (e) {
    console.error("Failed to save auth state to localStorage:", e);
  }
}

export const authStoreActions = {
  getState: (): AuthState => currentState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  login: (user: User, tokens: AuthTokens) => {
    currentState = {
      user,
      tokens,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
    saveState(currentState);
    notify();
  },

  logout: () => {
    currentState = {
      user: null,
      tokens: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
    saveState(currentState);
    notify();
  },

  setUser: (user: User) => {
    currentState = {
      ...currentState,
      user,
    };
    saveState(currentState);
    notify();
  },

  updateTokens: (tokens: Partial<AuthTokens>) => {
    if (currentState.tokens) {
      currentState = {
        ...currentState,
        tokens: {
          ...currentState.tokens,
          ...tokens,
        },
      };
      saveState(currentState);
      notify();
    }
  },

  setMustChangePassword: (mustChange: boolean) => {
    if (currentState.user) {
      currentState = {
        ...currentState,
        user: {
          ...currentState.user,
          mustChangePassword: mustChange,
        },
      };
      saveState(currentState);
      notify();
    }
  },
};

export function useAuthStore<T = AuthState>(
  selector?: (state: AuthState) => T,
): T {
  const snapshot = useSyncExternalStore(
    authStoreActions.subscribe,
    authStoreActions.getState,
    authStoreActions.getState,
  );

  if (selector) {
    return selector(snapshot);
  }
  return snapshot as unknown as T;
}
useAuthStore.getState = authStoreActions.getState;
useAuthStore.subscribe = authStoreActions.subscribe;
useAuthStore.login = authStoreActions.login;
useAuthStore.logout = authStoreActions.logout;
useAuthStore.setUser = authStoreActions.setUser;
useAuthStore.updateTokens = authStoreActions.updateTokens;
useAuthStore.setMustChangePassword = authStoreActions.setMustChangePassword;
