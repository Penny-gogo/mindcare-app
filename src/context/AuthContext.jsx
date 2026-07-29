import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化：从 localStorage 或 API 恢复用户状态
  useEffect(() => {
    const initUser = async () => {
      const saved = localStorage.getItem('eap_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
      setLoading(false);
    };
    initUser();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authApi.login(email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return result;
    } catch (error) {
      return { success: false, message: '登录失败，请稍后重试' };
    }
  };

  const register = async (name, email, password, role = 'employee', department = '') => {
    try {
      const result = await authApi.register(name, email, password, role, department);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return result;
    } catch (error) {
      return { success: false, message: '注册失败，请稍后重试' };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await authApi.updateProfile(updates);
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, message: '更新失败' };
    } catch (error) {
      return { success: false, message: '更新失败，请稍后重试' };
    }
  };

  const roleLabels = {
    employee: '员工',
    manager: '主管',
    hrbp: 'HRBP',
  };

  if (loading) {
    return null; // 或返回 loading 组件
  }

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