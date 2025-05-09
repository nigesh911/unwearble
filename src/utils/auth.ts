// Hardcoded admin credentials
const ADMIN_EMAIL = 'labib420agent@gmail.com';
const ADMIN_PASSWORD = 'yashverma';

// Authentication token key in localStorage
const AUTH_TOKEN_KEY = 'unwearble_auth_token';

/**
 * Authenticate user with email and password
 */
export const login = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = generateToken();
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  }
  return false;
};

/**
 * Logout user by removing auth token
 */
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
};

/**
 * Generate a simple token for authentication
 * In a real app, this would be a JWT token from the server
 */
const generateToken = (): string => {
  const randStr = Math.random().toString(36).substring(2, 15);
  const timestamp = new Date().getTime().toString();
  return `${randStr}_${timestamp}`;
};