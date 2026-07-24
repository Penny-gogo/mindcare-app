import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// 预设演示账号
const defaultUsers = [
  {
    id: 1,
    name: '张小明',
    email: 'employee@demo.com',
    password: '123456',
    role: 'employee',
    department: '技术研发部',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangXiaoMing&backgroundColor=b6e3f4',
  },
  {
    id: 2,
    name: '李经理',
    email: 'manager@demo.com',
    password: '123456',
    role: 'manager',
    department: '技术研发部',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiManager&backgroundColor=c0aede',
  },
  {
    id: 3,
    name: '王HR',
    email: 'hrbp@demo.com',
    password: '123456',
    role: 'hrbp',
    department: '人力资源部',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangHR&backgroundColor=ffd5dc',
  },
];

// 初始化默认用户
if (!localStorage.getItem('eap_users')) {
  localStorage.setItem('eap_users', JSON.stringify(defaultUsers));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eap_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('eap_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        department: found.department,
        avatar: found.avatar,
      };
      setUser(userData);
      localStorage.setItem('eap_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: '邮箱或密码错误' };
  };

  const register = (name, email, password, role = 'employee', department = '') => {
    const users = JSON.parse(localStorage.getItem('eap_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, message: '该邮箱已被注册' };
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      department: department || '未分配部门',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
    };
    users.push(newUser);
    localStorage.setItem('eap_users', JSON.stringify(users));
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatar: newUser.avatar,
    };
    setUser(userData);
    localStorage.setItem('eap_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eap_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('eap_user', JSON.stringify(updatedUser));
  };

  const roleLabels = {
    employee: '员工',
    manager: '主管',
    hrbp: 'HRBP',
  };

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