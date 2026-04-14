const getAuthToken = () => {
  let token = localStorage.getItem('token');
  // Fallback for cases where token might be stored inside the user object
  if (!token || token === 'undefined') {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      token = userData?.accessToken || userData?.token || null;
    } catch (e) {
      console.error('Could not parse user from localStorage', e);
      return null;
    }
  }
  return token;
};

const fetcher = async (path: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return { success: true, data: null };
  }

  return response.json();
};

export const apiClient = {
  get: (path: string, options?: RequestInit) => fetcher(path, { ...options, method: 'GET' }),
  post: (path: string, body: any, options?: RequestInit) => fetcher(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (path: string, body: any, options?: RequestInit) => fetcher(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string, options?: RequestInit) => fetcher(path, { ...options, method: 'DELETE' }),
};