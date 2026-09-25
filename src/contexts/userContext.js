import { createContext, useContext } from 'react';

export const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe utilizarse dentro de UserProvider');
  }
  return context;
};
