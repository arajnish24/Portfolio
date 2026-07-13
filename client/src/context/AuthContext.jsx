import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const loginTimeStr = localStorage.getItem("login_timestamp");
    if (storedToken && loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      const elapsedHours = (Date.now() - loginTime) / (1000 * 60 * 60);
      if (elapsedHours >= 2) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_timestamp");
        return null;
      }
      return storedToken;
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const loginTimeStr = localStorage.getItem("login_timestamp");
    if (storedUser && loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      const elapsedHours = (Date.now() - loginTime) / (1000 * 60 * 60);
      if (elapsedHours >= 2) {
        return null;
      }
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const [theme, setThemeState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed.themeSettings?.theme || "dark";
      } catch (e) {
        return "dark";
      }
    }
    return "dark";
  });

  useEffect(() => {
    // If state is mismatched or corrupted, clean it up
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if ((storedToken && !storedUser) || (!storedToken && storedUser)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("login_timestamp");
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "glassmorphism");

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("login_timestamp", Date.now().toString());
    if (newUser.themeSettings?.theme) {
      setThemeState(newUser.themeSettings.theme);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_timestamp");
  };

  const updateUser = (updatedUser) => {
    if (user) {
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      if (updatedUser.themeSettings?.theme) {
        setThemeState(updatedUser.themeSettings.theme);
      }
    }
  };

  const syncTheme = (newSettings) => {
    if (user) {
      const updated = { ...user, themeSettings: newSettings };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setThemeState(newSettings.theme);

      // Call API in background
      if (token) {
        fetch("/api/portfolio/appearance", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newSettings),
        }).catch((err) => console.error("Failed to sync theme:", err));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        theme,
        syncTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
