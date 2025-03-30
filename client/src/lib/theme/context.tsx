import { createContext } from 'react';

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
