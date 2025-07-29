import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

export interface GoogleAuthResponse {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  imageUrl: string;
  serverAuthCode: string;
  idToken: string;
  accessToken: string;
}

export interface BackendAuthRequest {
  serverAuthCode: string;
  email: string;
  name: string;
  imageUrl: string;
}

export interface BackendAuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    imageUrl: string;
  };
  message?: string;
}

class AuthService {
  private readonly BACKEND_URL = 'YOUR_BACKEND_URL'; // Replace with your backend URL

  async initialize() {
    if (Capacitor.isNativePlatform()) {
      await GoogleAuth.initialize();
    }
  }

  async signInWithGoogle(): Promise<GoogleAuthResponse> {
    try {
      await this.initialize();
      
      const result = await GoogleAuth.signIn();
      
      if (!result.serverAuthCode) {
        throw new Error('Server auth code not received from Google');
      }

      return {
        email: result.email,
        familyName: result.familyName,
        givenName: result.givenName,
        id: result.id,
        name: result.name,
        imageUrl: result.imageUrl,
        serverAuthCode: result.serverAuthCode,
        idToken: (result as any).idToken || '',
        accessToken: (result as any).accessToken || '',
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async authenticateWithBackend(googleAuth: GoogleAuthResponse): Promise<BackendAuthResponse> {
    try {
      const requestData: BackendAuthRequest = {
        serverAuthCode: googleAuth.serverAuthCode,
        email: googleAuth.email,
        name: googleAuth.name,
        imageUrl: googleAuth.imageUrl,
      };

      const response = await fetch(`${this.BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Backend authentication failed: ${response.statusText}`);
      }

      const result: BackendAuthResponse = await response.json();
      
      if (result.success && result.token) {
        // Store JWT token
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await GoogleAuth.signOut();
      }
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();