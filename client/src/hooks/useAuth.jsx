import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Named export for easier importing
export function useAuth() {
  return useContext(AuthContext);
}

// Default export for backward compatibility
export default useAuth;
