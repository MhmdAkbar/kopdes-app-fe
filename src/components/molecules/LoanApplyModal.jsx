// src/components/molecules/LoanApplyModal.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button.jsx';
import Icon from '../atoms/Icon.jsx';

export const LoanApplyModal = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({ purpose: '', requestedAmount: '', requestedTenor: '6' });

  useEffect(() => {
    if (isOpen) setFormData({ purpose: '', requestedAmount: '', requestedTenor: '6' });
  }, [isOpen]);

  // Logika Thousand Separator yang sama dengan TopupModal
  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = rawValue ? new Intl.NumberFormat('id-ID').format(rawValue) : '';
    setFormData({ ...formData, requestedAmount: formattedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bersihkan titik sebelum dikirim ke API/Parent
    const cleanAmount = formData.requestedAmount.replace(/\./g, '');
    
    onSubmit({
      purpose: formData.purpose,
      requestedAmount: Number(cleanAmount),
      requestedTenor: Number(formData.requestedTenor)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Pengajuan Modal</h3>
          <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-red-500">
            <Icon name="X" size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tujuan Modal</label>
            <input required type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none transition-all" placeholder="Misal: Modal ternak lele" disabled={isProcessing}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nominal Pengajuan (Rp)</label>
            <input 
              required 
              type="text" // Diubah ke text untuk format ribuan
              inputMode="numeric"
              value={formData.requestedAmount} 
              onChange={handleAmountChange} 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none transition-all font-semibold" 
              placeholder="Contoh: 10.000.000" 
              disabled={isProcessing}
            />
          </div>
          {/* ... sisa kode tenor tetap sama ... */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tenor (Bulan)</label>
            <select value={formData.requestedTenor} onChange={e => setFormData({...formData, requestedTenor: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none transition-all bg-white" disabled={isProcessing}>
              <option value="3">3 Bulan</option>
              <option value="6">6 Bulan</option>
              <option value="12">12 Bulan</option>
              <option value="24">24 Bulan</option>
            </select>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100">
            <Button type="submit" disabled={isProcessing}>{isProcessing ? 'Mengirim...' : 'Kirim Pengajuan'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};