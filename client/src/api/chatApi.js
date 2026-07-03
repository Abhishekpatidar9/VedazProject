const API_URL = import.meta.env.VITE_API_URL || 'https://realtime-chat-backend-j1cz.onrender.com';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.message || 'Request failed.';
    throw new Error(message);
  }

  return body.data;
}

export function fetchMessages(limit = 100) {
  return request(`/api/messages?limit=${limit}`);
}

export function sendMessageByRest({ username, content }) {
  return request('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ username, content })
  });
}
