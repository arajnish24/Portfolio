export const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Operation failed');
    }
    return data;
  } else {
    // Clean up response text stream
    await response.text();
    throw new Error(
      `The server returned HTML instead of JSON. This usually indicates:\n` +
      `1. Your backend Web Service on Render is currently offline, sleeping, or restarting.\n` +
      `2. If hosted separately, you forgot to configure the VITE_API_URL environment variable or Render Rewrite rules.`
    );
  }
};
