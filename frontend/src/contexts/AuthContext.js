import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const checkAuth = () => {
      const citizenAuth = AuthService.isAuthenticated('citizen');
      const adminAuth = AuthService.isAuthenticated('admin');
      
      if (citizenAuth) {
        setUser(citizenAuth);
      } else if (adminAuth) {
        setUser(adminAuth);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password, userType = 'citizen') => {
    try {
      let result;
      if (userType === 'citizen') {
        result = AuthService.loginCitizen(email, password);
      } else {
        result = AuthService.loginAdmin(email, password);
      }
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = (userType = 'citizen') => {
    AuthService.logout(userType);
    setUser(null);
  };

  const signup = async (userData, userType = 'citizen') => {
    try {
      let result;
      if (userType === 'citizen') {
        result = AuthService.signupCitizen(userData);
      } else {
        result = AuthService.signupAdmin(userData);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};