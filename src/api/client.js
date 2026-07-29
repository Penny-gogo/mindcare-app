// API 客户端 - 开发环境使用 JSON Server，生产环境回退到 localStorage
const API_BASE = import.meta.env.VITE_API_URL || '';

// 是否使用 API 模式（设置了 VITE_API_URL 环境变量时启用）
export const useApi = !!API_BASE;

// 通用请求方法
export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // 携带 token
  const token = localStorage.getItem('mindcare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `请求失败: ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

// GET
export async function get(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${endpoint}?${query}` : endpoint;
  return request(url);
}

// POST
export async function post(endpoint, data) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT
export async function put(endpoint, data) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// PATCH
export async function patch(endpoint, data) {
  return request(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// DELETE
export async function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}