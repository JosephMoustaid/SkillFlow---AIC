import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = Cookies.get('theme');
    if (savedTheme) {
      const isDarkMode = savedTheme === 'dark';
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode');
    Cookies.set('theme', newDarkMode ? 'dark' : 'light', { expires: 365 });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);