// src/components/molecules/UserDetailModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon.jsx';
import { useUserDetail } from '../../hooks/useUserDetail.js';

export const UserDetailModal = ({ isOpen, onClose, userId }) => {
  // Panggil hook untuk fetch data otomatis saat userId berubah
  const { userDetail: user, isLoading } = useUserDetail(userId);

  const formatRp = (value) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25 } }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 flex flex-col"
          >
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-kop-100 text-kop-main p-2 rounded-full">
                  <Icon name="UserSearch" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Detail Anggota</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 shadow-sm border border-slate-100">
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {/* STATE 1: LOADING SKELETON */}
              {isLoading && (
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-32 h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="w-20 h-4 bg-slate-200 rounded mb-8"></div>
                  <div className="w-full bg-slate-100 rounded-2xl h-40 mb-6"></div>
                  <div className="w-full flex gap-4">
                    <div className="flex-1 bg-slate-100 rounded-2xl h-24"></div>
                    <div className="flex-1 bg-slate-100 rounded-2xl h-24"></div>
                  </div>
                </div>
              )}

              {/* STATE 2: DATA BERHASIL DIMUAT */}
              {!isLoading && user && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                    <p className="text-slate-500 font-medium">{user.role?.replace('_', ' ')}</p>
                    <div className="mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Status: {user.isActive ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </div>
                  </div>

                  {/* Data Administratif Penuh */}
                  <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Icon name="IdCard" size={16} className="text-slate-400" /> Informasi Pribadi
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase mb-1">No. WhatsApp</p>
                        <p className="font-medium text-slate-700">{user.phoneNumber || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase mb-1">NIK</p>
                        <p className="font-medium text-slate-700">{user.nik || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Tempat, Tanggal Lahir</p>
                        <p className="font-medium text-slate-700">
                          {user.birthPlace ? `${user.birthPlace}, ` : ''} {formatDate(user.birthDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Jenis Kelamin</p>
                        <p className="font-medium text-slate-700">
                          {user.gender === 'MALE' ? 'Laki-laki' : user.gender === 'FEMALE' ? 'Perempuan' : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Finansial */}
                  {user.wallet && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                        <p className="text-green-600 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                          <Icon name="Wallet" size={14} /> Saldo Simpanan
                        </p>
                        <p className="font-bold text-green-700 text-lg tracking-tight">
                          {formatRp(user.wallet.savingsBalance)}
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                        <p className="text-blue-600 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                          <Icon name="Coins" size={14} /> Saldo Pinjaman
                        </p>
                        <p className="font-bold text-blue-700 text-lg tracking-tight">
                          {formatRp(user.wallet.loanBalance)}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STATE 3: DATA GAGAL DIMUAT / TIDAK ADA */}
              {!isLoading && !user && (
                <div className="text-center py-8 text-slate-400">
                  <Icon name="UserX" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Gagal memuat detail anggota.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};