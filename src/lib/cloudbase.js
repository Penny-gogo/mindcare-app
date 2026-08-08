// CloudBase 初始化模块 - 腾讯云开发 Web SDK
// 支持匿名登录 + 自定义登录（企业微信/手机号等）
// 文档：https://docs.cloudbase.net/api-reference/webv2/initialization

import cloudbase from '@cloudbase/js-sdk';

// CloudBase 环境 ID（从云函数 URL 提取）
// 格式：https://{env-id}.ap-shanghai.app.tcloudbase.com/
const CLOUDBASE_ENV_ID = import.meta.env.VITE_CLOUDBASE_ENV_ID || '';

// 检查是否已配置
export const isCloudBaseConfigured = Boolean(CLOUDBASE_ENV_ID);

// 初始化 CloudBase 实例
let appInstance = null;

function getApp() {
  if (!isCloudBaseConfigured) {
    console.warn('CloudBase 未配置，请设置 VITE_CLOUDBASE_ENV_ID');
    return null;
  }

  if (!appInstance) {
    appInstance = cloudbase.init({
      env: CLOUDBASE_ENV_ID,
      // 上海地域
      region: 'ap-shanghai',
    });
  }

  return appInstance;
}

// 获取认证实例
export function getAuth() {
  const app = getApp();
  if (!app) return null;

  return app.auth({
    persistence: 'local', // 持久化登录态到本地存储
  });
}

// 匿名登录 - 首次访问自动生成匿名 ID
// 返回 CloudBase 登录凭证，可用于后续升级为正式用户
export async function anonymousLogin() {
  const auth = getAuth();
  if (!auth) {
    throw new Error('CloudBase 认证服务未配置');
  }

  try {
    // 先检查是否已有登录态
    const loginState = await auth.getLoginState();
    if (loginState) {
      return loginState;
    }

    // 执行匿名登录
    const result = await auth.anonymousAuthProvider().signIn();
    console.log('CloudBase 匿名登录成功:', result.loginType);
    return result;
  } catch (error) {
    console.error('CloudBase 匿名登录失败:', error);
    throw error;
  }
}

// 获取当前登录状态
export async function getLoginState() {
  const auth = getAuth();
  if (!auth) return null;

  try {
    return await auth.getLoginState();
  } catch (error) {
    console.error('获取登录状态失败:', error);
    return null;
  }
}

// 获取 CloudBase 登录凭证（用于传给云函数验证身份）
export async function getAuthHeader() {
  const auth = getAuth();
  if (!auth) return null;

  try {
    const loginState = await auth.getLoginState();
    if (!loginState) return null;

    // CloudBase 的 HTTP 请求需要在 header 中携带认证信息
    // 格式：x-cloudbase-credentials: {loginState 序列化}
    return {
      'x-cloudbase-credentials': JSON.stringify(loginState),
    };
  } catch (error) {
    console.error('获取认证头失败:', error);
    return null;
  }
}

// 登出
export async function signOut() {
  const auth = getAuth();
  if (!auth) return;

  try {
    await auth.signOut();
    console.log('CloudBase 登出成功');
  } catch (error) {
    console.error('CloudBase 登出失败:', error);
    throw error;
  }
}

// 监听登录状态变化
export function onLoginStateChanged(callback) {
  const auth = getAuth();
  if (!auth) return () => {};

  return auth.onLoginStateChanged((loginState) => {
    callback(loginState);
  });
}

// 获取当前用户的 CloudBase UID
export async function getCurrentUserId() {
  const auth = getAuth();
  if (!auth) return null;

  try {
    const loginState = await auth.getLoginState();
    if (!loginState) return null;

    // 匿名用户：使用 anonymousUid
    // 正式用户：使用 user.uid
    return loginState.user?.uid || loginState.anonymousUid || null;
  } catch (error) {
    console.error('获取用户 ID 失败:', error);
    return null;
  }
}