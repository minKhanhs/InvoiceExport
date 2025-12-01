import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/invoices',
});

// API Functions
export const invoiceAPI = {
  // Lấy danh sách hóa đơn
  getInvoices: async (params = {}) => {
    const response = await API.get('/', { params });
    return response.data;
  },

  // Lấy chi tiết hóa đơn
  getInvoice: async (id) => {
    const response = await API.get(`/${id}`);
    return response.data;
  },

  // Tạo hóa đơn mới
  createInvoice: async (invoiceData) => {
    const response = await API.post('/', invoiceData);
    return response.data;
  },

  // Cập nhật hóa đơn
  updateInvoice: async (id, invoiceData) => {
    const response = await API.put(`/${id}`, invoiceData);
    return response.data;
  },

  // Xóa hóa đơn
  deleteInvoice: async (id) => {
    const response = await API.delete(`/${id}`);
    return response.data;
  },

  // Lấy thống kê
  getStats: async () => {
    const response = await API.get('/stats');
    return response.data;
  },

  // Lấy PDF (trả về URL)
  getPDFUrl: (id) => {
    return `http://localhost:3000/api/invoices/${id}/pdf`;
  },
};

export default API;
