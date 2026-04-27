// src/components/molecules/LoanOfferModal.jsx
import React from 'react';
import { Button } from '../atoms/Button.jsx';
import Icon from '../atoms/Icon.jsx';

export const LoanOfferModal = ({ isOpen, onClose, onDecision, isProcessing, loan }) => {
  if (!isOpen || !loan) return null;

  const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  const calculateInstallment = () => {
    const amount = Number(loan.approvedAmount) || 0;
    const margin = Number(loan.approvedMargin) || 0;
    const tenor = Number(loan.approvedTenor) || 1;
    return (amount + (amount * (margin / 100))) / tenor;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Icon name="FileBadge" className="text-amber-500" size={24} /> Penawaran Disetujui
          </h3>
          <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-red-500"><Icon name="X" size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loan.adminNotes && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 items-start">
              <Icon name="MessageSquareWarning" size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Catatan Admin</p>
                <p className="text-sm text-amber-900 font-medium leading-relaxed">"{loan.adminNotes}"</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Plafon Disetujui</span>
              <span className="text-slate-800 font-bold">{formatRp(loan.approvedAmount)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Tenor Cicilan</span>
              <span className="text-slate-800 font-bold">{loan.approvedTenor} Bulan</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Bagi Hasil / Margin</span>
              <span className="text-slate-800 font-bold">{loan.approvedMargin || 0}%</span>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden">
            <Icon name="Landmark" size={80} className="absolute -right-4 -bottom-4 opacity-10" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Kewajiban Cicilan Bulanan</p>
            <p className="text-3xl font-black text-kop-400 tracking-tight relative z-10">
              {formatRp(calculateInstallment())}
              <span className="text-base font-normal text-slate-300 ml-1">/ bln</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 text-slate-500 text-[11px] rounded-xl border border-slate-100 text-center">
            Dengan menekan tombol <b>Terima Penawaran</b>, dana akan otomatis dicairkan ke saldo simpanan Anda.
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button onClick={() => onDecision('REJECTED')} disabled={isProcessing} className="flex-1 py-3.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
            Tolak Penawaran
          </button>
          <Button onClick={() => onDecision('ACCEPTED')} disabled={isProcessing} className="flex-1 !w-auto shadow-md">
            {isProcessing ? 'Memproses...' : 'Terima & Cairkan Dana'}
          </Button>
        </div>
      </div>
    </div>
  );
};