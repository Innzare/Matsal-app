import { fetchWithAuth } from './clent';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API;

// Хелпер для обработки ошибок
const handleResponse = async (response: Response, fallbackError: string) => {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || fallbackError);
    } catch (e) {
      if (e instanceof Error && e.message !== fallbackError) {
        throw e;
      }
      throw new Error(fallbackError);
    }
  }
  return response.json();
};

export const authApi = {
  sendCode: async (phone: string) => {
    const response = await fetch(`${API_URL}/api/auth/customer/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    return handleResponse(response, 'Ошибка отправки кода');
  },

  verifyCode: async (phone: string, code: string) => {
    const response = await fetch(`${API_URL}/api/auth/customer/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });
    return handleResponse(response, 'Неверный код');
  },

  register: async (phone: string, name: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/customer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, password })
    });
    return handleResponse(response, 'Ошибка регистрации');
  },

  login: async (phone: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    return handleResponse(response, 'Неверный пароль');
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/api/auth/customer/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response, 'Не авторизован');
  },

  refresh: async (refreshToken: string) => {
    const response = await fetch(`${API_URL}/api/auth/customer/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    return handleResponse(response, 'Токен истёк');
  },

  logout: async (refreshToken: string) => {
    await fetch(`${API_URL}/api/auth/customer/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
  },

  updateProfile: async (token: string, data: { name?: string; email?: string }) => {
    const response = await fetchWithAuth(`${API_URL}/api/customer/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response, 'Ошибка обновления профиля');
  }
};
