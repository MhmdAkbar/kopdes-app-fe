// src/components/molecules/ProductFormModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../atoms/Button.jsx';
import { InputField } from './InputField.jsx';
import Icon from '../atoms/Icon.jsx';

export const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isProcessing }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stockQuantity: '', isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || { name: '', description: '', price: '', stockQuantity: '', isActive: true });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity)
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={!isProcessing ? onClose : undefined} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25 } }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">{initialData ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-red-500">
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <InputField id="name" label="Nama Produk" icon="Package" value={formData.name} onChange={handleChange} required disabled={isProcessing} />
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi</label>
                <textarea id="description" rows="3" value={formData.description} onChange={handleChange} disabled={isProcessing} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none transition-all resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField id="price" label="Harga (Rp)" icon="Banknote" type="number" min="0" value={formData.price} onChange={handleChange} required disabled={isProcessing} />
                <InputField id="stockQuantity" label="Stok Tersedia" icon="Boxes" type="number" min="0" value={formData.stockQuantity} onChange={handleChange} required disabled={isProcessing} />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={handleChange} disabled={isProcessing} className="w-5 h-5 text-kop-main rounded focus:ring-kop-main accent-kop-main" />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Tampilkan di Katalog</label>
              </div>

              <div className="pt-6 mt-2 border-t border-slate-100">
                <Button type="submit" disabled={isProcessing}>{isProcessing ? 'Menyimpan...' : 'Simpan Produk'}</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};