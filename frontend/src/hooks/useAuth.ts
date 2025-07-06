import React from "react";
import { AuthContext } from "../contexts/AuthContext";

// Used for grabbing the context and the info from it.
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
