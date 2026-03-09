/**
 * Theme Context Provider
 *
 * Provides theme switching capability (light/dark mode) throughout the app.
 * Usage:
 *   const { theme, isDark, toggleTheme } = useTheme();
 */

import React, { createContext, useContext, useState } from 'react';
import { getTheme } from './index';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = getTheme(isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme in any component
 * @returns {{ theme, isDark: boolean, toggleTheme: function }}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
