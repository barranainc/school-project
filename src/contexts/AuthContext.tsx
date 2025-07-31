import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'parent';
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

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'school_admin' | 'teacher' | 'parent';
  schoolId?: string;
}

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
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Demo users for testing
const DEMO_USERS: { [key: string]: User } = {
  school_admin: {
    id: 'admin-1',
    firstName: 'School',
    lastName: 'Admin',
    email: 'admin@school.com',
    role: 'school_admin',
    schoolId: 'school-1',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  teacher: {
    id: 'teacher-1',
    firstName: 'Jane',
    lastName: 'Teacher',
    email: 'teacher@school.com',
    role: 'teacher',
    schoolId: 'school-1',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  parent: {
    id: 'parent-1',
    firstName: 'Sarah',
    lastName: 'Parent',
    email: 'parent@email.com',
    role: 'parent',
    schoolId: 'school-1',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
  super_admin: {
    id: 'super-1',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'super@barrana.ai',
    role: 'super_admin',
    schoolId: 'barrana',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    lastLogin: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  },
};

// Auth reducer
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

// Context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await axios.get('/api/auth/me');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.data.user,
              token,
            },
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Demo authentication - use role to get demo user
      if (credentials.role && DEMO_USERS[credentials.role]) {
        const demoUser = DEMO_USERS[credentials.role];
        const token = `demo-token-${credentials.role}`;
        
        localStorage.setItem('token', token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: demoUser, token },
        });
        return;
      }
      
      // Real API call (fallback)
      const response = await axios.post('/api/auth/login', credentials);
      
      const { user, token } = response.data.data;
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axios.post('/api/auth/register', data);
      
      const { user, token } = response.data.data;
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 