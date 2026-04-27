// src/services/checkoutService.js
import api from './api.js';

export const checkoutService = {
  /**
   * Memproses transaksi belanja
   * @param {Object} payload - { paymentMethod, items: [{ productId, quantity }] }
   * @param {string} idempotencyKey - UUIDv4 unik untuk mencegah double charge
   */
  processCheckout: async (payload, idempotencyKey) => {
    const response = await api.post('/checkout', payload, {
      headers: {
        'X-Idempotency-Key': idempotencyKey
      }
    });
    return response.data;
  }
};