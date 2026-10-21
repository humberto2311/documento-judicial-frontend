import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reportes si lo deseas
    console.warn("Capturado por Error Boundary (usualmente causado por una extensión del navegador):", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="error">
              ¡Vaya! Algo interfirió con la página
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Detectamos un conflicto temporal en el navegador (a menudo causado por extensiones o traductores). Recarga la página para continuar.
            </Typography>
            <Button variant="contained" onClick={this.handleReload}>
              Recargar página
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;