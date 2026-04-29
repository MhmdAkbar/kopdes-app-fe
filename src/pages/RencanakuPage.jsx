// src/pages/RencanakuPage.jsx
import React, { useState } from 'react';
import { useLoans } from '../hooks/useLoans.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { Button } from '../components/atoms/Button.jsx';
import Icon from '../components/atoms/Icon.jsx';

import { LoanApplyModal } from '../components/molecules/LoanApplyModal.jsx';
import { LoanReviewModal } from '../components/molecules/LoanReviewModal.jsx';
import { LoanOfferModal } from '../components/molecules/LoanOfferModal.jsx';
import { LoanDetailModal } from '../components/molecules/LoanDetailModal.jsx';

export const RencanakuPage = () => {
  const { 
    loans, isLoading, isProcessing, isAdmin, 
    handleApplyLoan, handleReviewLoan, handleLoanDecision 
  } = useLoans();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, loan: null });
  const [offerModal, setOfferModal] = useState({ isOpen: false, loan: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, loanId: null });

  const formatRp = (value) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(value || 0);

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      OFFERED: 'bg-amber-100 text-amber-700 border-amber-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
      SUBMITTED: 'bg-blue-100 text-blue-700 border-blue-200',
      PAID_OFF: 'bg-emerald-600 text-white border-emerald-700',
      REVISION_REQUESTED: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return badges[status] || badges.SUBMITTED;
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-20 md:pb-8">
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Rencanaku</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Sistem Pengajuan Modal Syariah Smart Koperasi.</p>
          </div>
          {!isAdmin && (
            <Button 
              onClick={() => setIsApplyModalOpen(true)} 
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 shadow-lg shadow-kop-main/20"
            >
              <Icon name="HandCoins" size={18} /> Ajukan Modal
            </Button>
          )}
        </header>

        {/* List Section (Responsive Cards) */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
              <Icon name="Loader2" size={32} className="mx-auto text-kop-main animate-spin mb-3" />
              <p className="text-slate-500 font-medium animate-pulse">Memuat data pengajuan...</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Icon name="FileText" size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Belum ada pengajuan</h3>
              <p className="text-slate-500 text-sm">Anda belum memiliki riwayat pengajuan modal saat ini.</p>
            </div>
          ) : (
            loans.map((loan) => (
              <div 
                key={loan.id} 
                onClick={() => setDetailModal({ isOpen: true, loanId: loan.id })}
                className="bg-white rounded-[1.5rem] border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 cursor-pointer transition-all flex flex-col md:flex-row md:items-center gap-5 md:gap-8 group"
              >
                {/* Bagian 1: Status & Tujuan */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(loan.status)}`}>
                      {loan.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono tracking-widest">
                      #{loan.id.substring(0, 6)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-2 md:line-clamp-1" title={loan.purpose}>
                    {loan.purpose}
                  </h3>
                </div>

                {/* Bagian 2: Nominal Grid */}
                <div className="grid grid-cols-2 md:flex md:gap-10 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pengajuan</p>
                    <p className="font-bold text-slate-700 text-sm md:text-base">{formatRp(loan.requestedAmount)}</p>
                    <p className="text-xs text-slate-500 font-medium">{loan.requestedTenor} Bln</p>
                  </div>
                  <div className="relative">
                    {/* Pembatas vertikal untuk desktop */}
                    <div className="hidden md:block absolute -left-5 top-1 bottom-1 w-px bg-slate-100"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Disetujui</p>
                    <p className={`font-bold text-sm md:text-base ${loan.approvedAmount ? 'text-kop-main' : 'text-slate-400'}`}>
                      {loan.approvedAmount ? formatRp(loan.approvedAmount) : '-'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{loan.approvedTenor ? `${loan.approvedTenor} Bln` : '-'}</p>
                  </div>
                </div>

                {/* Bagian 3: Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 md:pt-0 border-t border-slate-100 border-dashed md:border-none">
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setDetailModal({ isOpen: true, loanId: loan.id });
                    }} 
                    className="flex-1 md:flex-none flex justify-center items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-500 bg-white hover:bg-slate-50 hover:text-kop-main border border-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    <Icon name="Eye" size={16} /> <span className="md:hidden lg:inline">Rincian</span>
                  </button>
                  
                  {!isAdmin && loan.status === 'OFFERED' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setOfferModal({ isOpen: true, loan });
                      }} 
                      className="flex-1 md:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                    >
                      Tinjau Penawaran
                    </button>
                  )}
                  
                  {isAdmin && loan.status === 'SUBMITTED' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setReviewModal({ isOpen: true, loan });
                      }} 
                      className="flex-1 md:flex-none px-4 py-2 bg-kop-main hover:bg-kop-600 text-white text-sm font-bold rounded-xl shadow-md shadow-kop-main/20 transition-all active:scale-95 cursor-pointer"
                    >
                      Tinjau Form
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Render Modals */}
      <LoanApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        onSubmit={(p) => handleApplyLoan(p, () => setIsApplyModalOpen(false))} 
        isProcessing={isProcessing} 
      />
      <LoanReviewModal 
        isOpen={reviewModal.isOpen} 
        loan={reviewModal.loan} 
        onClose={() => setReviewModal({ isOpen: false, loan: null })} 
        onSubmit={(p) => handleReviewLoan(reviewModal.loan.id, p, () => setReviewModal({ isOpen: false, loan: null }))} 
        isProcessing={isProcessing} 
      />
      <LoanOfferModal 
        isOpen={offerModal.isOpen} 
        loan={offerModal.loan} 
        onClose={() => setOfferModal({ isOpen: false, loan: null })} 
        onDecision={(d) => handleLoanDecision(offerModal.loan.id, d, () => setOfferModal({ isOpen: false, loan: null }))} 
        isProcessing={isProcessing} 
      />
      <LoanDetailModal 
        isOpen={detailModal.isOpen} 
        loanId={detailModal.loanId} 
        onClose={() => setDetailModal({ isOpen: false, loanId: null })} 
      />

    </DashboardLayout>
  );
};