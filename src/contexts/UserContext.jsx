import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserContext } from './userContext.js';

const formatUser = (userData) => ({
  uid: userData?.uid || userData?._id || userData?.user?.uid || userData?.user?._id,
  name: userData?.name || userData?.user?.name || 'Usuario',
  surname: userData?.surname || userData?.user?.surname,
  email: userData?.email || userData?.user?.email,
  profilePicture: userData?.profilePicture || userData?.user?.profilePicture,
  token: userData?.token,
  role: userData?.role || userData?.user?.role,
});

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error al leer los datos del usuario:', error);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = readStoredUser();
    const formattedUser = storedUser ? formatUser(storedUser) : null;
    return formattedUser?.token ? formattedUser : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedUser = readStoredUser();
    return Boolean(storedUser?.token);
  });

  const refreshUser = () => {
    const storedUser = readStoredUser();
    const formattedUser = storedUser ? formatUser(storedUser) : null;
    const hasValidSession = Boolean(formattedUser?.token);
    setUser(hasValidSession ? formattedUser : null);
    setIsAuthenticated(hasValidSession);
  };

  const login = (userData) => {
    const formattedUser = formatUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(formattedUser);
    setIsAuthenticated(Boolean(formattedUser.token));
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserData = (newUserData, showSuccessMessage = true) => {
    try {
      const currentUser = readStoredUser();
      if (!currentUser) return false;

      const updatedUser = { ...currentUser, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(formatUser(updatedUser));

      if (showSuccessMessage) {
        toast.success('Perfil actualizado correctamente');
      }
      return true;
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      if (showSuccessMessage) {
        toast.error('Error al actualizar el perfil');
      }
      return false;
    }
  };

  const getUserInitials = () => {
    const name = user?.name || 'Usuario';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user') refreshUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, updateUserData, getUserInitials, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
