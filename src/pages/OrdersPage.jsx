// src/pages/OrdersPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useOrders } from '../hooks/useOrders.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { OrderDetailModal } from '../components/molecules/OrderDetailModal.jsx';
import Icon from '../components/atoms/Icon.jsx';

export const OrdersPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  
  const { 
    orders, meta, page, statusFilter, isLoading, changePage, changeStatus 
  } = useOrders(10);

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  const statusOptions = [
    { label: 'Semua', value: '' },
    { label: 'Selesai', value: 'COMPLETED' },
    { label: 'Tertunda', value: 'PENDING' },
    { label: 'Dibatalkan', value: 'CANCELLED' },
  ];

  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Pesanan</h1>
          <p className="text-slate-500 mt-1">Daftar seluruh transaksi belanja koperasi Anda.</p>
        </div>

        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => changeStatus(opt.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === opt.value ? 'bg-kop-main text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">
                <th className="p-5">Waktu & ID</th>
                {isAdmin && <th className="p-5">Anggota</th>}
                <th className="p-5">Total</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan="5" className="p-12 text-center text-slate-400 animate-pulse font-medium">Memuat riwayat...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-slate-400 font-medium">Belum ada pesanan ditemukan.</td></tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-800">{new Date(ord.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{ord.id}</p>
                    </td>
                    {isAdmin && (
                      <td className="p-5">
                        <p className="text-sm font-bold text-slate-700">{ord.userName || 'Member'}</p>
                      </td>
                    )}
                    <td className="p-5">
                      <p className="text-sm font-black text-kop-main">{formatRp(ord.totalAmount)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{ord.paymentMethod === 'SAVINGS' ? 'Simpanan' : 'Kasbon'}</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ord.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                        ord.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => setSelectedOrderId(ord.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-kop-main hover:text-white text-slate-600 text-xs font-bold rounded-lg transition-all"
                      >
                        <Icon name="Eye" size={14} /> Faktur
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && meta.totalPages > 1 && (
          <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Halaman {meta.currentPage} dari {meta.totalPages}</p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:bg-slate-100 transition-all hover:border-kop-main"
              >
                <Icon name="ChevronLeft" size={18} />
              </button>
              <button 
                disabled={page === meta.totalPages}
                onClick={() => changePage(page + 1)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:bg-slate-100 transition-all hover:border-kop-main"
              >
                <Icon name="ChevronRight" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailModal 
        isOpen={!!selectedOrderId} 
        onClose={() => setSelectedOrderId(null)} 
        orderId={selectedOrderId} 
      />
    </DashboardLayout>
  );
};