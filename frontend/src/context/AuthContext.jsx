import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/protected`,
          {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const { success, message, user: userData } = response.data;

      if (success) {
        setUser(userData);
        return { success: true, message };
      } else {
        return { success: false, message: message || 'Login failed.' };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'An unexpected error occurred.';
      return { success: false, message: errorMessage };
    }
  };

  const signUp = async (username, email, password, role, adminKey) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role, adminKey }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Account created successfully!' };
      } else {
        return { success: false, message: data.message || 'Something went wrong.' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'An unexpected error occurred.' };
    }
  };

  const logout = async () => {
    if (!user) {
      return { success: false, message: 'No user to log out.' };
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUser(null);
      return { success: true, message: 'Logged out successfully.' };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Error during logout.';
      return { success: false, message: errorMessage };
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};