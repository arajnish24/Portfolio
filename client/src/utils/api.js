export const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Operation failed');
    }
    return data;
  } else {
    // Non-JSON response (usually HTML gateway timeout/error pages)
    const text = await response.text();
    if (response.status === 504 || response.status === 502 || response.status === 404) {
      throw new Error('Backend server connection refused. Please ensure the backend is running on port 5000 and the Vite dev port matches.');
    }
    throw new Error(text || `Server returned error status ${response.status}`);
  }
};
