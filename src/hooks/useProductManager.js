// src/hooks/useProductManager.js
import { useState } from 'react';
import { productService } from '../services/productService.js';
import toast from 'react-hot-toast';

export const useProductManager = (onSuccessCallback) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreate = async (productData) => {
    setIsProcessing(true);
    const toastId = toast.loading('Menambahkan produk baru...');
    try {
      await productService.createProduct(productData);
      toast.success('Produk berhasil ditambahkan!', { id: toastId });
      if (onSuccessCallback) onSuccessCallback();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambah produk.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (id, productData) => {
    setIsProcessing(true);
    const toastId = toast.loading('Menyimpan perubahan...');
    try {
      await productService.updateProduct(id, productData);
      toast.success('Produk berhasil diperbarui!', { id: toastId });
      if (onSuccessCallback) onSuccessCallback();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui produk.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    setIsProcessing(true);
    const toastId = toast.loading('Menghapus produk...');
    try {
      await productService.deleteProduct(id);
      toast.success('Produk berhasil dihapus.', { id: toastId });
      if (onSuccessCallback) onSuccessCallback();
    } catch (error) {
      toast.error('Gagal menghapus produk.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadImages = async (productId, files) => {
    if (!files || files.length === 0) return;
    
    setIsProcessing(true);
    const toastId = toast.loading('Mengunggah gambar...');
    try {
      await productService.uploadProductImages(productId, files);
      toast.success('Gambar berhasil diunggah!', { id: toastId });
      if (onSuccessCallback) onSuccessCallback();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengunggah gambar.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    setIsProcessing(true);
    const toastId = toast.loading('Menghapus gambar...');
    try {
      await productService.deleteProductImage(imageId);
      toast.success('Gambar dihapus.', { id: toastId });
      if (onSuccessCallback) onSuccessCallback();
    } catch (error) {
      toast.error('Gagal menghapus gambar.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleUploadImages,
    handleDeleteImage
  };
};