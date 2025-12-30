import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocument: async (id) => {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  },

  listDocuments: async () => {
    const response = await api.get('/api/documents/');
    return response.data;
  },

  processDocument: async (id) => {
    const response = await api.post(`/api/documents/${id}/process`);
    return response.data;
  },
};

export const loanAPI = {
  getLoan: async (id) => {
    const response = await api.get(`/api/loans/${id}`);
    return response.data;
  },

  listLoans: async () => {
    const response = await api.get('/api/loans/');
    return response.data;
  },

  getLoansByDocument: async (documentId) => {
    const response = await api.get(`/api/loans/document/${documentId}`);
    return response.data;
  },
};

export const covenantAPI = {
  getCovenant: async (id) => {
    const response = await api.get(`/api/covenants/${id}`);
    return response.data;
  },

  listCovenants: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/api/covenants/', { params });
    return response.data;
  },

  getLoanCovenants: async (loanId) => {
    const response = await api.get(`/api/covenants/loan/${loanId}`);
    return response.data;
  },

  updateCovenant: async (id, data) => {
    const response = await api.patch(`/api/covenants/${id}`, data);
    return response.data;
  },

  getAtRiskCovenants: async () => {
    const response = await api.get('/api/covenants/alerts/at-risk');
    return response.data;
  },
};

export default api;
