import React, { useState, useEffect } from 'react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Smartphone } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
}

export const AuthScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userData = authService.getUser();
      setUser(userData);
    }
  }, []);

  const handleSignInSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-google-surface to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-[var(--shadow-elevated)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">Welcome back!</CardTitle>
            <CardDescription>{user.name}</CardDescription>
            <CardDescription className="text-sm">{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-auth-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Authentication Flow:</strong> Google OAuth → ServerAuthCode → Backend Verification → JWT Token
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-google-surface to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-elevated)]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-auth-primary rounded-full">
              <Smartphone className="h-8 w-8 text-auth-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in with your Google account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-auth-secondary p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Authentication Flow:</h3>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>1. Google OAuth with ServerAuthCode</li>
              <li>2. Send ServerAuthCode to backend</li>
              <li>3. Backend verifies with Google</li>
              <li>4. Create/activate user & generate JWT</li>
            </ol>
          </div>
          
          <GoogleSignInButton
            onSuccess={handleSignInSuccess}
            onError={(error) => console.error('Auth error:', error)}
          />
          
          <p className="text-xs text-center text-muted-foreground">
            This app uses Capacitor with native Google Sign-In capabilities
          </p>
        </CardContent>
      </Card>
    </div>
  );
};