/**
 * api.js — Axios service for communicating with the Vitto backend API
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * Submit a loan application to the backend.
 * @param {Object} formData - The loan application payload
 * @returns {Promise<Object>} - The API response data
 */
export const submitLoanApplication = async (formData) => {
  const response = await apiClient.post('/application', formData);
  return response.data;
};

export default apiClient;
