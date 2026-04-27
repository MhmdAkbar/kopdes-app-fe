// src/pages/RencanakuPage.jsx
import React, { useState } from 'react';
import { useLoans } from '../hooks/useLoans.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { Button } from '../components/atoms/Button.jsx';
import Icon from '../components/atoms/Icon.jsx';

// Import Modals
import { LoanApplyModal } from '../components/molecules/LoanApplyModal.jsx';
import { LoanReviewModal } from '../components/molecules/LoanReviewModal.jsx';
import { LoanOfferModal } from '../components/molecules/LoanOfferModal.jsx';

export const RencanakuPage = () => {
  const { 
    loans, isLoading, isProcessing, isAdmin, 
    handleApplyLoan, handleReviewLoan, handleLoanDecision 
  } = useLoans();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, loan: null });
  const [offerModal, setOfferModal] = useState({ isOpen: false, loan: null });

  const formatRp = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      OFFERED: 'bg-amber-100 text-amber-700 border-amber-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
      SUBMITTED: 'bg-blue-100 text-blue-700 border-blue-200',
      PAID_OFF: 'bg-slate-100 text-slate-700 border-slate-200',
      REVISION_REQUESTED: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return badges[status] || badges.SUBMITTED;
  };

  const onApplySubmit = (payload) => {
    handleApplyLoan(payload, () => setIsApplyModalOpen(false));
  };

  const onReviewSubmit = (payload) => {
    handleReviewLoan(reviewModal.loan.id, payload, () => setReviewModal({ isOpen: false, loan: null }));
  };

  const onMemberDecision = (decision) => {
    handleLoanDecision(offerModal.loan.id, decision, () => setOfferModal({ isOpen: false, loan: null }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Rencanaku</h1>
            <p className="text-slate-500 mt-1">Sistem Pengajuan Modal Syariah Smart Koperasi.</p>
          </div>
          {!isAdmin && (
            <Button onClick={() => setIsApplyModalOpen(true)} className="!w-auto flex items-center gap-2 px-6">
              <Icon name="PiggyBank" size={18} /> Ajukan Modal
            </Button>
          )}
        </header>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">
                  <th className="p-5">ID & Tujuan</th>
                  <th className="p-5 text-right">Pengajuan</th>
                  <th className="p-5 text-right">Disetujui (Plafon)</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-400 animate-pulse font-medium">Memuat data...</td></tr>
                ) : loans.length === 0 ? (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-400 font-medium">Belum ada pengajuan.</td></tr>
                ) : (
                  loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5">
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{loan.purpose}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{loan.id}</p>
                      </td>
                      <td className="p-5 text-right">
                        <p className="text-sm font-bold text-slate-700">{formatRp(loan.requestedAmount)}</p>
                        <p className="text-xs text-slate-500">{loan.requestedTenor} Bulan</p>
                      </td>
                      <td className="p-5 text-right">
                        <p className="text-sm font-black text-kop-main">{loan.approvedAmount ? formatRp(loan.approvedAmount) : '-'}</p>
                        <p className="text-xs text-slate-500">{loan.approvedTenor ? `${loan.approvedTenor} Bulan` : '-'}</p>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(loan.status)}`}>
                          {loan.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        {!isAdmin && loan.status === 'OFFERED' && (
                          <button onClick={() => setOfferModal({ isOpen: true, loan })} disabled={isProcessing} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm">
                            Lihat Penawaran
                          </button>
                        )}
                        {isAdmin && loan.status === 'SUBMITTED' && (
                          <button onClick={() => setReviewModal({ isOpen: true, loan })} disabled={isProcessing} className="px-3 py-1.5 bg-kop-main hover:bg-kop-600 text-white text-xs font-bold rounded-lg shadow-sm">
                            Tinjau Pengajuan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <LoanApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} onSubmit={onApplySubmit} isProcessing={isProcessing} />
      <LoanReviewModal isOpen={reviewModal.isOpen} loan={reviewModal.loan} onClose={() => setReviewModal({ isOpen: false, loan: null })} onSubmit={onReviewSubmit} isProcessing={isProcessing} />
      <LoanOfferModal isOpen={offerModal.isOpen} loan={offerModal.loan} onClose={() => setOfferModal({ isOpen: false, loan: null })} onDecision={onMemberDecision} isProcessing={isProcessing} />

    </DashboardLayout>
  );
};