/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength (at least 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
