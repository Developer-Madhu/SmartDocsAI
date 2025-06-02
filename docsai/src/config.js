const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    SIGNIN: `${API_BASE_URL}/api/auth/signin`,
    USER: `${API_BASE_URL}/api/auth/user`,
  },
  DOCUMENTS: {
    LIST: `${API_BASE_URL}/api/documents`,
    CREATE: `${API_BASE_URL}/api/documents`,
    GET: (id) => `${API_BASE_URL}/api/documents/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/documents/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/documents/${id}`,
  },
  AI: {
    GENERATE: `${API_BASE_URL}/api/ai/generate`,
  },
}; 