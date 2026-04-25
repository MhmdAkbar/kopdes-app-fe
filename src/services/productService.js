// src/services/productService.js
import api from "./api.js";

export const productService = {
  // --- BAGIAN 1: KATALOG ---

  getProducts: async () => {
    const response = await api.get("/products");
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // --- BAGIAN 2: MANAJEMEN PRODUK (ADMIN) ---

  createProduct: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // --- BAGIAN 3: MANAJEMEN GAMBAR (ADMIN) ---
  /**
   * Uploads multiple images to a specific product using multipart/form-data.
   * @param {string} productId - Product ID
   * @param {File[]} files - Array of File objects from input type="file"
   * @returns {Promise<Object>} Uploaded images data
   */
  uploadProductImages: async (productId, files) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file); // Nama harus persis 'images'
    });

    // KUNCI PERBAIKAN ADA DI SINI:
    // Kita menimpa (override) header default 'application/json' menjadi 'multipart/form-data'
    // agar Axios otomatis membuat 'boundary' file yang bisa dibaca oleh Multer Backend.
    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  deleteProductImage: async (imageId) => {
    const response = await api.delete(`/products/images/${imageId}`);
    return response.data;
  },
};
