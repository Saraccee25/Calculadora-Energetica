import axios from 'axios';
import { auth } from '../config/firebase';
import { getAuthHeader } from '../auth/getAuthHeader';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response } = error;
        if (response && response.status === 401) {
          await auth.signOut();
          window.location.href = '/login?reason=session-expired';
          return Promise.reject('Sesión expirada');
        }
        return Promise.reject(error);
      }
    );
  }

  async getAsync(path, { requireAuth = false, params = {}, headers = {} } = {}) {
    const finalHeaders = await this._buildHeaders(requireAuth, headers);
    const res = await this.client.get(path, { params, headers: finalHeaders });
    return res.data;
  }

  async postAsync(path, data, { requireAuth = false, headers = {} } = {}) {
    const finalHeaders = await this._buildHeaders(requireAuth, headers);
    const res = await this.client.post(path, data, { headers: finalHeaders });
    return res.data;
  }

  async putAsync(path, data, { requireAuth = false, headers = {} } = {}) {
    const finalHeaders = await this._buildHeaders(requireAuth, headers);
    const res = await this.client.put(path, data, { headers: finalHeaders });
    return res.data;
  }

  async deleteAsync(path, { requireAuth = false, headers = {} } = {}) {
    const finalHeaders = await this._buildHeaders(requireAuth, headers);
    const res = await this.client.delete(path, { headers: finalHeaders });
    return res.data;
  }

  async postFormAsync(path, formData, { requireAuth = false, headers = {} } = {}) {
    const finalHeaders = await this._buildHeaders(requireAuth, headers);
    delete finalHeaders['Content-Type'];
    const res = await this.client.post(path, formData, { headers: finalHeaders });
    return res.data;
  }

  async _buildHeaders(requireAuth, headers) {
    let authHeaders = {};
    if (requireAuth) {
      authHeaders = await getAuthHeader();
    }
    return {
      'Content-Type': 'application/json',
      ...headers,
      ...authHeaders,
    };
  }
}

const apiClient = new ApiClient();
export default apiClient;