// 认证 API - 开发环境走 JSON Server，生产环境走 localStorage
import { useApi, get, post, put, patch } from './client';

const USERS_KEY = 'eap_users';
const USER_KEY = 'eap_user';

// localStorage 辅助
function getLocalUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
function setLocalUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getLocalUser() {
  const saved = localStorage.getItem(USER_KEY);
  return saved ? JSON.parse(saved) : null;
}
function setLocalUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// 初始化默认用户（localStorage 模式）
const defaultUsers = [
  {
    id: 1, name: '张小明', email: 'employee@demo.com', password: '123456',
    role: 'employee', department: '技术研发部',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangXiaoMing&backgroundColor=b6e3f4',
  },
  {
    id: 2, name: '李经理', email: 'manager@demo.com', password: '123456',
    role: 'manager', department: '技术研发部',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiManager&backgroundColor=c0aede',
  },
  {
    id: 3, name: '王HR', email: 'hrbp@demo.com', password: '123456',
    role: 'hrbp', department: '人力资源部',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangHR&backgroundColor=ffd5dc',
  },
];

if (!localStorage.getItem(USERS_KEY)) {
  setLocalUsers(defaultUsers);
}

// 登录
export async function login(email, password) {
  if (useApi) {
    // JSON Server: 通过 email 查找用户
    const users = await get('/users', { email });
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { id: found.id, name: found.name, email: found.email, role: found.role, department: found.department, avatar: found.avatar };
      // 模拟 token
      const token = btoa(JSON.stringify(userData));
      localStorage.setItem('mindcare_token', token);
      setLocalUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, message: '邮箱或密码错误' };
  }

  // localStorage 回退
  const users = getLocalUsers();
  const found = users.find(u => u.email === email && u.password === password);
  if (found) {
    const userData = { id: found.id, name: found.name, email: found.email, role: found.role, department: found.department, avatar: found.avatar };
    setLocalUser(userData);
    return { success: true, user: userData };
  }
  return { success: false, message: '邮箱或密码错误' };
}

// 注册
export async function register(name, email, password, role = 'employee', department = '') {
  if (useApi) {
    // 检查邮箱是否已存在
    const existing = await get('/users', { email });
    if (existing.length > 0) {
      return { success: false, message: '该邮箱已被注册' };
    }
    const newUser = await post('/users', {
      name, email, password, role,
      department: department || '未分配部门',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
    });
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department, avatar: newUser.avatar };
    const token = btoa(JSON.stringify(userData));
    localStorage.setItem('mindcare_token', token);
    setLocalUser(userData);
    return { success: true, user: userData };
  }

  // localStorage 回退
  const users = getLocalUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: '该邮箱已被注册' };
  }
  const newUser = {
    id: Date.now(), name, email, password, role,
    department: department || '未分配部门',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
  };
  users.push(newUser);
  setLocalUsers(users);
  const userData = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department, avatar: newUser.avatar };
  setLocalUser(userData);
  return { success: true, user: userData };
}

// 获取当前用户
export async function getCurrentUser() {
  if (useApi) {
    const token = localStorage.getItem('mindcare_token');
    if (!token) return null;
    try {
      const userData = JSON.parse(atob(token));
      return userData;
    } catch {
      return null;
    }
  }
  return getLocalUser();
}

// 更新用户资料
export async function updateProfile(updates) {
  if (useApi) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;
    const updated = await patch(`/users/${currentUser.id}`, updates);
    const userData = { id: updated.id, name: updated.name, email: updated.email, role: updated.role, department: updated.department, avatar: updated.avatar };
    setLocalUser(userData);
    return userData;
  }

  const currentUser = getLocalUser();
  if (!currentUser) return null;
  const updatedUser = { ...currentUser, ...updates };
  setLocalUser(updatedUser);
  return updatedUser;
}

// 登出
export function logout() {
  localStorage.removeItem('mindcare_token');
  localStorage.removeItem(USER_KEY);
}