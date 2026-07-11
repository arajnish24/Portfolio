import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    // Load authentication credentials
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.themeSettings?.theme) {
        setThemeState(parsedUser.themeSettings.theme);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'glassmorphism');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    if (newUser.themeSettings?.theme) {
      setThemeState(newUser.themeSettings.theme);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    if (user) {
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem('user', JSON.stringify(mergedUser));
      if (updatedUser.themeSettings?.theme) {
        setThemeState(updatedUser.themeSettings.theme);
      }
    }
  };

  const syncTheme = (newSettings) => {
    if (user) {
      const updated = { ...user, themeSettings: newSettings };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setThemeState(newSettings.theme);

      // Call API in background
      if (token) {
        fetch('/api/portfolio/appearance', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newSettings)
        }).catch(err => console.error('Failed to sync theme:', err));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, theme, syncTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
