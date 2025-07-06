import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { getCurrentUser, logoutUser } from "../api/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await getCurrentUser();
      setIsAuthenticated(response.authenticated);
    } catch (error) {
      console.error({ error });
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
