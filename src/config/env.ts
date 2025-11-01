/**
 * Environment Configuration for FridayOS
 * 
 * This file centralizes all environment-specific configuration.
 * In production, these values should be sourced from tekup-secrets.
 */

export const ENV = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.tekup.dk',
  API_TIMEOUT: 30000, // 30 seconds
  
  // WebSocket Configuration
  WS_URL: process.env.EXPO_PUBLIC_WS_URL || 'wss://api.tekup.dk',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  GOOGLE_REDIRECT_URI: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI || 'fridayos://oauth/callback',
  
  // Feature Flags
  ENABLE_OFFLINE_MODE: true,
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_DEBUG_LOGGING: __DEV__,
  
  // App Configuration
  APP_VERSION: '1.0.0',
  APP_NAME: 'FridayOS',
} as const;

export type EnvConfig = typeof ENV;
