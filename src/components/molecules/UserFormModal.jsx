// src/components/molecules/UserFormModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../atoms/Button.jsx';
import { InputField } from './InputField.jsx';
import Icon from '../atoms/Icon.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const UserFormModal = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '', phoneNumber: '', password: '', role: 'MEMBER'
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', phoneNumber: '', password: '', role: 'MEMBER' });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Registrasi Anggota</h3>
              <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-red-500">
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <InputField id="name" label="Nama Lengkap" icon="User" value={formData.name} onChange={handleChange} required disabled={isProcessing} />
              <InputField id="phoneNumber" label="Nomor WhatsApp" icon="Phone" type="tel" inputMode="numeric" value={formData.phoneNumber} onChange={handleChange} required disabled={isProcessing} />
              <InputField id="password" label="Kata Sandi Awal" icon="Lock" type="password" value={formData.password} onChange={handleChange} required disabled={isProcessing} />
              
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">Peran Akses (Role)</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none bg-white transition-all disabled:bg-slate-50"
                >
                  <option value="MEMBER">Anggota (Member)</option>
                  {currentUser?.role === 'SUPER_ADMIN' && <option value="ADMIN">Administrator</option>}
                </select>
              </div>

              <div className="pt-6 mt-2 border-t border-slate-100">
                <Button type="submit" disabled={isProcessing}>{isProcessing ? 'Mendaftarkan...' : 'Daftarkan Anggota'}</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};