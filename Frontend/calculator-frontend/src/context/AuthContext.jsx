import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserByEmail } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Si hay usuario en Firebase Auth, obtener datos adicionales de Firestore
        try {
          const userData = await getUserByEmail(firebaseUser.email);
          if (userData) {
            const composedUser = {
              id: userData.id,
              email: userData.email,
              nombre: userData.nombre,
              apellido: userData.apellido,
              cedula: userData.cedula,
              estrato: userData.estrato,
              fechaRegistro: userData.fechaRegistro,
              firebaseUid: firebaseUser.uid,
              role: userData.role
            };
            setUser(composedUser);
            try {
              const token = await firebaseUser.getIdToken();
              localStorage.setItem('authToken', token);
            } catch (e) {
              console.error('No se pudo obtener y guardar el ID token:', e);
            }
          } else {
            setUser(null);
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setUser(null);
          localStorage.removeItem('authToken');
        }
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('authToken');
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      console.error('Error en logout:', error);
      return {
        success: false,
        errors: {
          general: 'Error al cerrar sesión'
        }
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
