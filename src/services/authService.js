import { getApperClient, getApperUI } from "../utils/apperClient";

/**
 * Sets up the authentication UI in the specified container
 * @param {string} containerId - The ID of the container element
 * @param {Function} onSuccessCallback - Callback function executed on successful authentication
 * @param {Function} onErrorCallback - Callback function executed on authentication error
 */
export const setupAuthUI = (containerId, onSuccessCallback, onErrorCallback) => {
  const apperClient = getApperClient();
  const ApperUI = getApperUI();
  
  if (!apperClient || !ApperUI) {
    console.error("Apper SDK not loaded yet");
    return;
  }
  
  ApperUI.setup(apperClient, {
    target: containerId,
    clientId: apperClient.canvasId,
    view: 'both', // Show both login and signup
    onSuccess: (user, account) => {
      // Store user information in localStorage
      storeUserData(user.data);
      
      // Call the success callback
      if (onSuccessCallback) {
        onSuccessCallback(user, account);
      }
    },
    onError: (error) => {
      console.error("Authentication error:", error);
      
      // Call the error callback
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    }
  });
  
  // Show the login view by default
  ApperUI.showLogin(containerId);
};

/**
 * Shows the login view in the authentication container
 * @param {string} containerId - The ID of the container element
 */
export const showLogin = (containerId) => {
  const ApperUI = getApperUI();
  
  if (ApperUI) {
    ApperUI.showLogin(containerId);
  }
};

/**
 * Shows the signup view in the authentication container
 * @param {string} containerId - The ID of the container element
 */
export const showSignup = (containerId) => {
  const ApperUI = getApperUI();
  
  if (ApperUI) {
    ApperUI.showSignup(containerId);
  }
};

/**
 * Stores user data in localStorage
 * @param {Object} userData - The user data to store
 */
export const storeUserData = (userData) => {
  if (userData) {
    localStorage.setItem('apperUser', JSON.stringify(userData));
  }
};

/**
 * Retrieves user data from localStorage
 * @returns {Object|null} The user data or null if not found
 */
export const getUserData = () => {
  const userData = localStorage.getItem('apperUser');
  
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
  
  return null;
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getUserData();
};

/**
 * Logs out the user by removing their data from localStorage
 */
export const logout = () => {
  localStorage.removeItem('apperUser');
};

export default {
  setupAuthUI,
  showLogin,
  showSignup,
  storeUserData,
  getUserData,
  isAuthenticated,
  logout
};