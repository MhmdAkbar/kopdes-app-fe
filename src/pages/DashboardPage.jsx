// src/pages/DashboardPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTopup } from '../hooks/useTopup.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { TopupModal } from '../components/molecules/TopupModal.jsx';
import Icon from '../components/atoms/Icon.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const { handleTopup, isProcessing } = useTopup(() => setIsTopupModalOpen(false));

  const formatRp = (value) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(value || 0);
  };

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center md:text-left">
          Ringkasan Finansial
        </h1>
        <p className="text-slate-500 text-sm mt-1 text-center md:text-left">
          Selamat datang kembali, <span className="font-semibold text-slate-700">{user?.name}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Savings Card */}
        <div className="bg-gradient-to-br from-kop-600 to-kop-800 rounded-[2rem] p-7 text-white shadow-xl shadow-kop-900/20 relative overflow-hidden group min-h-[220px] md:min-h-[240px]">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Icon name="Wallet" size={140} />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-kop-100 opacity-80">
                  <p className="text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em]">
                    Saldo Simpanan
                  </p>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-white/20 rounded-md transition-all active:scale-90 flex items-center justify-center"
                  >
                    <Icon 
                      name={showBalance ? "EyeOff" : "Eye"} 
                      className="size-3.5 md:size-4 lg:size-5 transition-all" 
                    />
                  </button>
                </div>
                
                <div className="h-12 flex items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.h2 
                      key={showBalance ? 'v-savings' : 'h-savings'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
                    >
                      {showBalance ? formatRp(user?.wallet?.savingsBalance) : '••••••••'}
                    </motion.h2>
                  </AnimatePresence>
                </div>
              </div>
              
              <button 
                onClick={() => setIsTopupModalOpen(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white text-white hover:text-kop-700 backdrop-blur-md rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 shrink-0"
              >
                + Top Up
              </button>
            </div>

            <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-4">
              <div className="text-[10px] text-kop-200 font-medium">
                <p className="opacity-70">NOMOR ANGGOTA</p>
                <p className="text-white text-sm tracking-widest font-mono">
                  {user?.id?.substring(0, 8).toUpperCase() || 'MEMBER-ID'}
                </p>
              </div>
              <Icon name="Leaf" size={24} className="opacity-40" />
            </div>
          </div>
        </div>

        {/* Loan Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] p-7 text-white shadow-xl shadow-slate-900/40 relative overflow-hidden group min-h-[220px] md:min-h-[240px]">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Icon name="Landmark" size={140} /> 
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="space-y-1 mb-6">
              <div className="flex items-center gap-2 text-slate-400">
                <p className="text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em]">
                  Tagihan Pinjaman
                </p>
              </div>
              
              <div className="h-12 flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.h2 
                    key={showBalance ? 'v-loan' : 'h-loan'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-100"
                  >
                    {showBalance ? formatRp(user?.wallet?.loanBalance) : '••••••••'}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-4">
              <div className="text-[10px] text-slate-400 font-medium">
                <p className="opacity-70 uppercase">Status Pinjaman</p>
                <p className={`text-sm tracking-wide font-bold ${user?.wallet?.loanBalance > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {user?.wallet?.loanBalance > 0 ? 'DALAM CICILAN' : 'TIDAK ADA TAGIHAN'}
                </p>
              </div>
              
              {user?.wallet?.loanBalance > 0 && (
                <button className="text-[11px] font-bold text-kop-400 hover:text-kop-300 transition-colors uppercase tracking-wider flex items-center gap-1 group/link">
                  Detail 
                  <Icon name="ChevronRight" size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <TopupModal 
        isOpen={isTopupModalOpen} 
        onClose={() => setIsTopupModalOpen(false)} 
        onSubmit={handleTopup}
        isProcessing={isProcessing}
      />
    </DashboardLayout>
  );
};