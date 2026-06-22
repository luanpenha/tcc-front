export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const TOKEN_KEY = 'sai3d_token';
const USER_KEY = 'sai3d_user';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const getAuthUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const setAuthUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const apiFetch = async (path, { method = 'GET', body = null, headers = {}, auth = true } = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const init = {
    method,
    headers: { ...headers },
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      init.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (body != null && !(body instanceof FormData)) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    init.body = body;
  }

  const response = await fetch(url, init);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { success: response.ok, data: text, message: response.statusText };
  }

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'Erro na requisição');
  }
  return data;
};

export default {
  API_BASE,
  apiFetch,
  getAuthToken,
  getAuthUser,
  setAuthToken,
  setAuthUser,
  clearAuth,
};
