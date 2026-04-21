// src/services/paymentService.js
import api from './api.js';

export const paymentService = {
  /**
   * Initiates a top-up transaction.
   * @param {number} amount - The amount to top up.
   * @returns {Promise<Object>} The API response containing the paymentUrl.
   */
  initiateTopup: async (amount) => {
    const response = await api.post('/payments/topup', { amount: Number(amount) });
    return response.data;
  }
};