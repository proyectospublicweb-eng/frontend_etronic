import { useCallback, useEffect, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest, logoutRequest } from "../api/auth.js";
import { AuthContext } from "./useAuth.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await verifyTokenRequest();
      if (res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    verifyTokenRequest()
      .then((res) => {
        if (!active) return;
        if (res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const register = async (userData) => {
    const res = await registerRequest(userData);
    setUser(res.data);
    setIsAuthenticated(true);
    return res.data;
  };

  const login = async (userData) => {
    const res = await loginRequest(userData);
    setUser(res.data);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.rol === "admin",
        loading,
        register,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
