export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Form App';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const THEME = {
  primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#282c52',
  primaryColorHover: getComputedStyle(document.documentElement).getPropertyValue('--primary-color-hover').trim() || '#1f2242',
  maxWidth: getComputedStyle(document.documentElement).getPropertyValue('--max-width').trim() || '800px',
  snackbarDuration: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--snackbar-duration').trim() || '6000'),
  redirectDelay: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--redirect-delay').trim() || '2000'),
};
