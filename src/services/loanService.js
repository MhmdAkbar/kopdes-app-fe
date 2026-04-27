// src/services/loanService.js
import api from './api.js';

export const loanService = {
  /**
   * Submits a new loan application (Member only)
   * @param {Object} payload - { purpose, requestedAmount, requestedTenor }
   */
  submitLoan: async (payload) => {
    const response = await api.post('/loans/submit', payload);
    return response.data;
  },

  /**
   * Updates loan status and sets offer details (Admin only)
   * @param {string} id - Loan ID
   * @param {Object} payload - { status, approvedAmount, approvedTenor, approvedMargin, adminNotes }
   */
  reviewLoan: async (id, payload) => {
    const response = await api.put(`/loans/${id}/review`, payload);
    return response.data;
  },

  /**
   * Accepts or rejects an offered loan, triggering disbursement if accepted (Member only)
   * @param {string} id - Loan ID
   * @param {Object} payload - { status: "ACCEPTED" | "REJECTED" }
   * @param {string} idempotencyKey - UUIDv4 to prevent double-charging/disbursement
   */
  decideLoan: async (id, payload, idempotencyKey) => {
    const response = await api.post(`/loans/${id}/decision`, payload, {
      headers: { 'X-Idempotency-Key': idempotencyKey }
    });
    return response.data;
  },

  /**
   * Retrieves loans belonging to the authenticated member
   */
  getMyLoans: async () => {
    const response = await api.get('/loans/my-loans');
    return response.data;
  },

  /**
   * Retrieves all loan applications (Admin only)
   */
  getAllLoans: async () => {
    const response = await api.get('/loans');
    return response.data;
  }
};