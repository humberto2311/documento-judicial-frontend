import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Permite exponer variables sin prefijo `VITE_` pero con prefijo `API_`
  // Ej: Railway puede inyectar `API_URL`, y estará disponible como `import.meta.env.API_URL`.
  envPrefix: ['VITE_', 'API_'],
  plugins: [react()],
})
