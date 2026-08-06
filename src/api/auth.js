import { isSupabaseConfigured, supabase } from '../lib/supabase';

function ensureConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('认证服务尚未配置');
  }
}

function toUser(authUser) {
  if (!authUser) return null;
  const metadata = authUser.user_metadata || {};
  return {
    id: authUser.id,
    email: authUser.email,
    name: metadata.name || authUser.email?.split('@')[0] || '用户',
    role: metadata.role || 'employee',
    department: metadata.department || '未分配部门',
    avatar: metadata.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authUser.id)}&backgroundColor=b6e3f4`,
  };
}

export async function login(email, password) {
  ensureConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, message: error.message === 'Invalid login credentials' ? '邮箱或密码错误' : error.message };
  return { success: true, user: toUser(data.user) };
}

export async function register(name, email, password, role = 'employee', department = '') {
  ensureConfigured();
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        department: department || '未分配部门',
        avatar,
      },
    },
  });
  if (error) return { success: false, message: error.message };
  return {
    success: true,
    user: toUser(data.user),
    requiresEmailConfirmation: !data.session,
  };
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return toUser(data.user);
}

export async function getAccessToken() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function updateProfile(updates) {
  ensureConfigured();
  const allowed = ['name', 'role', 'department', 'avatar'];
  const safeUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowed.includes(key)));
  const { data, error } = await supabase.auth.updateUser({ data: safeUpdates });
  if (error) throw error;
  return toUser(data.user);
}

export async function logout() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requestPasswordReset(email) {
  ensureConfigured();
  // 生产环境使用正式域名，开发环境使用 localhost
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const redirectTo = `${siteUrl}/?recovery=1`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function updatePassword(password) {
  ensureConfigured();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { success: false, message: error.message };
  return { success: true };
}

export function onAuthStateChange(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    // PASSWORD_RECOVERY 事件：用户从重置邮件链接回来，Supabase 已自动提取 token
    // 使用 replace 避免回退到包含 token 的 URL
    if (event === 'PASSWORD_RECOVERY') {
      window.location.replace('/#/reset-password');
      return;
    }
    callback(toUser(session?.user));
  });
  return () => data.subscription.unsubscribe();
}