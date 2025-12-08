// Configuración de la URL del API
// En producción, usar la variable de entorno VITE_API_BASE_URL
// En desarrollo, usar localhost

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://calculadora-energetica-back.onrender.com/api';

// URL sin el prefijo /api para casos especiales
export const API_SERVER_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://calculadora-energetica-back.onrender.com';

