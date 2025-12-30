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

export const proposalAPI = {
  createProposal: async (data) => {
    const response = await api.post('/api/loan-proposals/', data);
    return response.data;
  },

  listProposals: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/api/loan-proposals/', { params });
    return response.data;
  },

  getProposal: async (id) => {
    const response = await api.get(`/api/loan-proposals/${id}`);
    return response.data;
  },

  getResearch: async (id) => {
    const response = await api.get(`/api/loan-proposals/${id}/research`);
    return response.data;
  },

  getPitch: async (id) => {
    const response = await api.get(`/api/loan-proposals/${id}/pitch`);
    return response.data;
  },

  triggerResearch: async (id) => {
    const response = await api.post(`/api/loan-proposals/${id}/research`);
    return response.data;
  },

  generatePitch: async (id) => {
    const response = await api.post(`/api/loan-proposals/${id}/pitch`);
    return response.data;
  },
};

export const bankAPI = {
  listBanks: async (filters = {}) => {
    const response = await api.get('/api/banks/', { params: filters });
    return response.data;
  },

  searchBanks: async (params) => {
    const response = await api.get('/api/banks/search', { params });
    return response.data;
  },

  getBank: async (id) => {
    const response = await api.get(`/api/banks/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/banks/stats');
    return response.data;
  },
};

export const quotationAPI = {
  createQuotations: async (data) => {
    const response = await api.post('/api/quotations/', data);
    return response.data;
  },

  listQuotations: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/api/quotations/', { params });
    return response.data;
  },

  getQuotationsForProposal: async (proposalId) => {
    const response = await api.get(`/api/quotations/proposal/${proposalId}`);
    return response.data;
  },

  getQuotation: async (id) => {
    const response = await api.get(`/api/quotations/${id}`);
    return response.data;
  },

  regenerateQuotation: async (id) => {
    const response = await api.post(`/api/quotations/${id}/regenerate`);
    return response.data;
  },
};

export default api;
