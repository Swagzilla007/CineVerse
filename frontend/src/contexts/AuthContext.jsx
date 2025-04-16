import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/login', {
        email,
        password,
      });
      
      setUser(response.data.user);
      setAuthToken(response.data.access_token);
      navigate('/');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'An error occurred during login';
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await api.post('/api/register', {
        name,
        email,
        password,
        password_confirmation,
      });
      
      setUser(response.data.user);
      setAuthToken(response.data.access_token);
      navigate('/');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'An error occurred during registration';
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAuthToken(null);
      navigate('/login');
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/api/user');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);