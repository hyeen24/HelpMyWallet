import { darkTheme, lightTheme } from '@/constants/Theme';
import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = typeof lightTheme;

interface ThemeContextType {
  theme: ThemeType;
  colorScheme: 'light' | 'dark' | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const rawColorScheme = useColorScheme(); // 'light' | 'dark' | null | undefined
  const colorScheme: 'light' | 'dark' | null = rawColorScheme === 'light' || rawColorScheme === 'dark' ? rawColorScheme : null;
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};
