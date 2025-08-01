import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'teacher' | 'parent';
  schoolId?: string;
  isEmailVerified: boolean;
  preferences?: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  lastLogin?: string;
  lastActivity?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

// Demo users for mobile app
const DEMO_USERS: { [key: string]: User } = {
  // Barrana AI School - Teachers
  teacher1: {
    id: 'T001',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@barranaischool.edu',
    role: 'teacher',
    schoolId: 'SCH001',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  teacher2: {
    id: 'T002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@barranaischool.edu',
    role: 'teacher',
    schoolId: 'SCH001',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  // Barrana Day Care - Teachers
  daycare_teacher1: {
    id: 'T101',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@barranadaycare.edu',
    role: 'teacher',
    schoolId: 'SCH002',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  // Barrana AI School - Parents
  parent1: {
    id: 'P001',
    firstName: 'Jennifer',
    lastName: 'Smith',
    email: 'jennifer.smith@email.com',
    role: 'parent',
    schoolId: 'SCH001',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  parent2: {
    id: 'P002',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@email.com',
    role: 'parent',
    schoolId: 'SCH001',
    isEmailVerified: true,
    preferences: {
      language: 'es',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  // Barrana Day Care - Parents
  daycare_parent1: {
    id: 'P101',
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica.martinez@email.com',
    role: 'parent',
    schoolId: 'SCH002',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}>({
  ...initialState,
  login: async () => {},
  logout: () => {},
  clearError: () => {},
  updateUser: () => {},
});

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token },
          });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: 'No stored credentials' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to check authentication' });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Demo authentication logic
      let user: User | null = null;
      
      // Check for specific demo users
      const demoUser = Object.values(DEMO_USERS).find(u => 
        u.email === credentials.email && credentials.password === 'demo123'
      );
      
      if (demoUser) {
        user = demoUser;
      }

      if (user) {
        const token = `demo-token-${user.id}`;
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, token } 
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 