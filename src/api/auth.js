// CloudBase 认证服务层
// 支持：匿名登录（默认）+ 自定义登录（企业微信/手机号）
// 文档：https://docs.cloudbase.net/api-reference/webv2/authentication

import { 
  isCloudBaseConfigured, 
  getAuth, 
  anonymousLogin, 
  getLoginState, 
  signOut, 
  onLoginStateChanged, 
  getCurrentUserId 
} from '../lib/cloudbase';

// ===== 用户模型转换 =====
// 将 CloudBase 登录态转换为前端使用的用户对象
function toUser(loginState) {
  if (!loginState) return null;

  const user = loginState.user || {};
  const isAnonymous = loginState.loginType === 'ANONYMOUS';

  return {
    id: user.uid || loginState.anonymousUid || 'unknown',
    email: user.email || null,
    name: user.nickName || (isAnonymous ? '匿名用户' : '用户'),
    role: user.role || 'employee',
    department: user.department || '未分配部门',
    avatar: user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.uid || 'anonymous')}&backgroundColor=b6e3f4`,
    isAnonymous,
    // CloudBase 原始数据保留
    loginType: loginState.loginType,
    cloudbaseUser: user,
  };
}

// ===== 确保 CloudBase 已配置 =====
function ensureConfigured() {
  if (!isCloudBaseConfigured) {
    throw new Error('CloudBase 认证服务尚未配置，请设置 VITE_CLOUDBASE_ENV_ID');
  }
}

// ===== 匿名登录（默认方式） =====
// 用户首次访问自动生成匿名 ID，无需注册
export async function login(email, password) {
  ensureConfigured();
  
  try {
    // 方案B 默认使用匿名登录
    // 如需邮箱登录，后续可通过自定义登录扩展
    const loginState = await anonymousLogin();
    return { 
      success: true, 
      user: toUser(loginState) 
    };
  } catch (error) {
    console.error('登录失败:', error);
    return { 
      success: false, 
      message: error.message || '登录失败，请稍后重试' 
    };
  }
}

// ===== 注册（暂用匿名登录替代） =====
// 后续可通过 CloudBase 自定义登录实现邮箱/手机号注册
export async function register(name, email, password, role = 'employee', department = '') {
  ensureConfigured();
  
  try {
    // 当前阶段：注册即匿名登录
    // 后续可扩展为 CloudBase 自定义登录（手机号/企业微信）
    const loginState = await anonymousLogin();
    return {
      success: true,
      user: toUser(loginState),
      requiresEmailConfirmation: false, // 匿名登录无需邮箱验证
    };
  } catch (error) {
    console.error('注册失败:', error);
    return { 
      success: false, 
      message: error.message || '注册失败，请稍后重试' 
    };
  }
}

// ===== 获取当前用户 =====
export async function getCurrentUser() {
  if (!isCloudBaseConfigured) return null;
  
  try {
    const loginState = await getLoginState();
    return toUser(loginState);
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
}

// ===== 获取访问令牌（CloudBase 登录凭证） =====
export async function getAccessToken() {
  if (!isCloudBaseConfigured) return null;
  
  try {
    const loginState = await getLoginState();
    if (!loginState) return null;
    
    // CloudBase 登录凭证用于云函数验证
    // 返回 JSON 序列化的登录态
    return JSON.stringify(loginState);
  } catch (error) {
    console.error('获取访问令牌失败:', error);
    return null;
  }
}

// ===== 更新用户资料 =====
export async function updateProfile(updates) {
  ensureConfigured();
  
  const auth = getAuth();
  if (!auth) throw new Error('认证服务未初始化');
  
  try {
    // CloudBase 当前支持更新用户资料
    // 后续可通过数据库存储更多字段
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('用户未登录');
    
    // 合并更新
    const updatedUser = {
      ...currentUser,
      ...updates,
    };
    
    return updatedUser;
  } catch (error) {
    console.error('更新资料失败:', error);
    throw error;
  }
}

// ===== 登出 =====
export async function logout() {
  if (!isCloudBaseConfigured) return;
  
  try {
    await signOut();
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
}

// ===== 密码重置（暂不支持） =====
export async function requestPasswordReset(email) {
  // CloudBase 匿名登录无密码，暂不支持
  return { 
    success: false, 
    message: '当前版本不支持密码重置，请使用匿名登录' 
  };
}

// ===== 更新密码（暂不支持） =====
export async function updatePassword(password) {
  return { 
    success: false, 
    message: '当前版本不支持修改密码' 
  };
}

// ===== 监听认证状态变化 =====
export function onAuthStateChange(callback) {
  if (!isCloudBaseConfigured) return () => {};
  
  return onLoginStateChanged((loginState) => {
    const user = toUser(loginState);
    callback(user);
  });
}

// ===== 导出工具函数 =====
export { isCloudBaseConfigured, getCurrentUserId };