import React, { useState, useEffect, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ThemeContextType, ThemeContext } from './context';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check if dark mode was previously set in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Optionally update body/html class for global styles
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to explicitly set theme
  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  // Define theme algorithm based on mode
  const algorithm = isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm;

  // Custom theme tokens
  const themeConfig = {
    algorithm: algorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 4,
    },
    components: {
      Layout: {
        siderBg: isDarkMode ? '#141414' : '#fff',
        headerBg: isDarkMode ? '#141414' : '#fff',
      }
    }
  };

  const contextValue: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};