export function validateMessagePayload(payload = {}) {
  const errors = [];
  const username = typeof payload.username === 'string' ? payload.username.trim() : '';
  const content = typeof payload.content === 'string' ? payload.content.trim() : '';

  if (!username) errors.push('Username is required.');
  if (username.length > 32) errors.push('Username must be 32 characters or fewer.');
  if (!content) errors.push('Message content is required.');
  if (content.length > 1000) errors.push('Message must be 1000 characters or fewer.');

  return {
    isValid: errors.length === 0,
    errors,
    value: { username, content }
  };
}
