// api/client.ts
import { useAuthStore } from '@/store/useAuthStore';

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const { accessToken, refreshTokens, logout } = useAuthStore.getState();

  // Добавляем токен
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };

  let response = await fetch(url, { ...options, headers });

  // Если 401 - пробуем обновить токен
  if (response.status === 401) {
    const refreshed = await refreshTokens();

    if (refreshed) {
      // Повторяем запрос с новым токеном
      const newToken = useAuthStore.getState().accessToken;
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    } else {
      // Не удалось обновить - разлогиниваем
      await logout();
      throw new Error('Сессия истекла');
    }
  }

  return response;
};
