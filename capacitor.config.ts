import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8ac57721564e4b6aa8f111cf54bf6a73',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://8ac57721-564e-4b6a-a8f1-11cf54bf6a73.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_GOOGLE_SERVER_CLIENT_ID', // Replace with your Google server client ID
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;