import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import DocumentProcessForm from './components/DocumentProcessForm';
import ErrorBoundary from './components/ErrorBoundary';
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DocumentProcessForm />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;