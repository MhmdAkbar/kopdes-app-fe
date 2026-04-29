// src/components/molecules/LoanReviewModal.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button.jsx';
import Icon from '../atoms/Icon.jsx';

export const LoanReviewModal = ({ isOpen, onClose, onSubmit, isProcessing, loan }) => {
  const [formData, setFormData] = useState({ approvedAmount: '', approvedTenor: '', approvedMargin: '5', adminNotes: '' });

  // Formatter untuk tampilan label & estimasi (tetap konsisten)
  const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  // Formatter internal untuk input (hanya angka ke format titik)
  const toThousand = (val) => {
    if (!val) return '';
    const raw = val.toString().replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(raw);
  };

  useEffect(() => {
    if (isOpen && loan) {
      setFormData({
        // Pastikan data awal dari member juga langsung diformat ribuan
        approvedAmount: toThousand(loan.requestedAmount),
        approvedTenor: loan.requestedTenor,
        approvedMargin: '5',
        adminNotes: ''
      });
    }
  }, [isOpen, loan]);

  const calculateInstallment = () => {
    // Bersihkan titik sebelum menghitung
    const amount = Number(formData.approvedAmount.toString().replace(/\./g, '')) || 0;
    const margin = Number(formData.approvedMargin) || 0;
    const tenor = Number(formData.approvedTenor) || 1;
    return (amount + (amount * (margin / 100))) / tenor;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bersihkan titik sebelum dikirim ke API
    const cleanAmount = formData.approvedAmount.toString().replace(/\./g, '');
    
    onSubmit({
      status: 'OFFERED',
      approvedAmount: Number(cleanAmount),
      approvedTenor: Number(formData.approvedTenor),
      approvedMargin: Number(formData.approvedMargin),
      adminNotes: formData.adminNotes
    });
  };

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Icon name="ShieldCheck" className="text-kop-main" size={24} /> Tinjau & Beri Penawaran
          </h3>
          <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-red-500"><Icon name="X" size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Permintaan Member:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><p className="text-xs text-slate-500">Tujuan</p><p className="font-semibold text-slate-800 truncate">{loan.purpose}</p></div>
              <div><p className="text-xs text-slate-500">Nominal</p><p className="font-semibold text-slate-800">{formatRp(loan.requestedAmount)}</p></div>
              <div><p className="text-xs text-slate-500">Tenor</p><p className="font-semibold text-slate-800">{loan.requestedTenor} Bulan</p></div>
            </div>
          </div>

          <form id="reviewForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Plafon Disetujui (Rp)</label>
                <input 
                  required 
                  type="text" // Diubah ke text agar bisa pakai format ribuan
                  inputMode="numeric"
                  value={formData.approvedAmount} 
                  onChange={e => setFormData({...formData, approvedAmount: toThousand(e.target.value)})} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none font-bold text-slate-800" 
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tenor Disetujui (Bulan)</label>
                <input required type="number" value={formData.approvedTenor} onChange={e => setFormData({...formData, approvedTenor: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none font-mono" disabled={isProcessing}/>
              </div>
            </div>
            {/* ... bagian margin dan catatan tetap sama ... */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Bagi Hasil / Margin Koperasi (%)</label>
              <div className="relative">
                <input required type="number" step="0.1" value={formData.approvedMargin} onChange={e => setFormData({...formData, approvedMargin: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none pr-10 font-mono" disabled={isProcessing}/>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Catatan Admin (Opsional)</label>
              <textarea rows="2" value={formData.adminNotes} onChange={e => setFormData({...formData, adminNotes: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none resize-none" disabled={isProcessing}></textarea>
            </div>
            <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Estimasi Cicilan Member</p>
                <p className="text-2xl font-black text-emerald-700 tracking-tight">{formatRp(calculateInstallment())} <span className="text-sm font-semibold text-emerald-600/70">/ bln</span></p>
              </div>
              <Icon name="Calculator" size={32} className="text-emerald-200" />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors" disabled={isProcessing}>Batal</button>
          <Button type="submit" form="reviewForm" disabled={isProcessing} className="!w-auto px-8 shadow-md">
            {isProcessing ? 'Kirim Penawaran' : 'Kirim Penawaran'}
          </Button>
        </div>
      </div>
    </div>
  );
};