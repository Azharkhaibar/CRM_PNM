import { createContext, useContext } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth.hook';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
