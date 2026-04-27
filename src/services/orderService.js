// src/services/orderService.js
import api from './api.js';

export const orderService = {
  /**
   * Mengambil daftar pesanan dengan paginasi dan filter
   * @param {Object} params - { page, limit, status }
   */
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  /**
   * Mengambil rincian faktur/detail satu pesanan
   * @param {string} id - Order ID
   */
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Memperbarui status pesanan (Hanya Admin)
   * @param {string} id - Order ID
   * @param {string} status - PENDING, COMPLETED, CANCELLED
   */
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};