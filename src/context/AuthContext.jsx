import { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

// Create the auth context
const AuthContext = createContext();

/**
 * Provider component for authentication state and methods
 * @param {Object} props - Component props
 * @returns {JSX.Element} The AuthProvider component
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = authService.getUserData();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * Handle successful authentication
   * @param {Object} userData - The authenticated user data
   * @param {Object} accountData - The account data
   */
  const handleAuthSuccess = (userData, accountData) => {
    setUser(userData.data);
    setError(null);
  };

  /**
   * Handle authentication error
   * @param {Error} err - The authentication error
   */
  const handleAuthError = (err) => {
    setError(err.message || 'Authentication failed');
    setUser(null);
  };

  /**
   * Set up the authentication UI
   * @param {string} containerId - The ID of the container element
   */
  const setupAuth = (containerId) => {
    authService.setupAuthUI(
      containerId,
      handleAuthSuccess,
      handleAuthError
    );
  };

  /**
   * Show the login UI
   * @param {string} containerId - The ID of the container element
   */
  const showLogin = (containerId) => {
    authService.showLogin(containerId);
  };

  /**
   * Show the signup UI
   * @param {string} containerId - The ID of the container element
   */
  const showSignup = (containerId) => {
    authService.showSignup(containerId);
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Check if the user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  const isAuthenticated = () => {
    return !!user;
  };

  // Create the context value object with state and methods
  const value = {
    user,
    loading,
    error,
    setupAuth,
    showLogin,
    showSignup,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the auth context
 * @returns {Object} The auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;