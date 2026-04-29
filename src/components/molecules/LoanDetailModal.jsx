/* src/components/molecules/LoanDetailModal.jsx */
import React from 'react';
import { useLoanDetail } from '../../hooks/useLoanDetail.js';
import Icon from '../atoms/Icon.jsx';

export const LoanDetailModal = ({ isOpen, onClose, loanId }) => {
  const { loan, isLoading } = useLoanDetail(loanId);

  const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const getInstallmentStatusColor = (status) => {
    const colors = {
      UNPAID: 'bg-slate-100 text-slate-600',
      PAID: 'bg-emerald-100 text-emerald-700',
      LATE: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.UNPAID;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Icon name="FileText" className="text-kop-main" size={24} /> Detail Pinjaman
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-20 text-center animate-pulse text-slate-400 font-medium">Memuat data...</div>
          ) : loan ? (
            <div className="space-y-8">
              {/* Plafon Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Plafon</p>
                  <p className="font-bold text-slate-800 text-sm">{formatRp(loan.approvedAmount || loan.requestedAmount)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tenor</p>
                  <p className="font-bold text-slate-800 text-sm">{loan.approvedTenor || loan.requestedTenor} Bulan</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Margin</p>
                  <p className="font-bold text-slate-800 text-sm">{loan.approvedMargin || 0}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</p>
                  <p className="font-bold text-kop-main text-sm">{loan.status}</p>
                </div>
              </div>

              {/* Installment Table - Conditional Rendering */}
              {loan.installments && loan.installments.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Icon name="CalendarDays" size={18} className="text-kop-main" /> Jadwal Cicilan
                  </h4>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-200">
                        <tr>
                          <th className="p-4">Bulan Ke</th>
                          <th className="p-4">Jatuh Tempo</th>
                          <th className="p-4">Tagihan</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loan.installments.map((inst) => (
                          <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-bold text-slate-700">#{inst.monthSequence}</td>
                            <td className="p-4 text-slate-600">{formatDate(inst.dueDate)}</td>
                            <td className="p-4 font-bold text-slate-800">{formatRp(inst.amount)}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getInstallmentStatusColor(inst.status)}`}>
                                {inst.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                  <Icon name="Info" size={32} className="mx-auto text-blue-300 mb-3" />
                  <p className="text-sm text-blue-700 font-medium">Jadwal cicilan akan diterbitkan otomatis setelah dana pinjaman dicairkan.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">Gagal memuat detail pinjaman.</div>
          )}
        </div>
      </div>
    </div>
  );
};