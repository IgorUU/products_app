import React from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
