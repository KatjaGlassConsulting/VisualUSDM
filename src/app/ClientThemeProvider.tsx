'use client';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
