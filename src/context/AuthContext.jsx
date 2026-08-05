import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authApi.getCurrentUser()
      .then(currentUser => {
        if (active) setUser(currentUser);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const unsubscribe = authApi.onAuthStateChange(nextUser => {
      if (active) {
        setUser(nextUser);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authApi.login(email, password);
      if (result.success) setUser(result.user);
      return result;
    } catch (error) {
      return { success: false, message: error.message || '登录失败，请稍后重试' };
    }
  };

  const register = async (name, email, password, role = 'employee', department = '') => {
    try {
      const result = await authApi.register(name, email, password, role, department);
      if (result.success && !result.requiresEmailConfirmation) setUser(result.user);
      return result;
    } catch (error) {
      return { success: false, message: error.message || '注册失败，请稍后重试' };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await authApi.updateProfile(updates);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || '更新失败，请稍后重试' };
    }
  };

  const roleLabels = {
    employee: '员工',
    manager: '主管',
    hrbp: 'HRBP',
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, roleLabels }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};