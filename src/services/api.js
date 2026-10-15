const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

/**
 * Common request wrapper with credentials: 'include' and JSON headers
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('gga_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Sends HttpOnly session cookies
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  async login(usernameOrEmail, password) {
    const data = await request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password })
    });
    if (data.token) {
      localStorage.setItem('gga_admin_token', data.token);
    }
    return data;
  },

  async logout() {
    try {
      await request('/api/admin/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('gga_admin_token');
    }
  },

  async getSession() {
    return request('/api/admin/session', { method: 'GET' });
  },

  // Enquiries Management
  async getEnquiries({ search = '', status = '', service = '', page = 1, limit = 15, sort = '-createdAt' } = {}) {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (status && status !== 'all') query.append('status', status);
    if (service && service !== 'all') query.append('service', service);
    query.append('page', String(page));
    query.append('limit', String(limit));
    query.append('sort', sort);

    return request(`/api/admin/enquiries?${query.toString()}`, { method: 'GET' });
  },

  async getEnquiryById(id) {
    return request(`/api/admin/enquiries/${id}`, { method: 'GET' });
  },

  async updateEnquiryStatus(id, { status, adminNotes }) {
    return request(`/api/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes })
    });
  },

  async deleteEnquiry(id) {
    return request(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
  }
};

export default api;
