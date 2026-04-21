// src/pages/DashboardPage.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import Icon from '../components/atoms/Icon.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  const formatRp = (value) => {
    if (!showBalance) return 'Rp •••••••';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Ringkasan Finansial</h1>
          <p className="text-slate-500 mt-1">Selamat datang kembali, <span className="font-semibold text-slate-700">{user?.name}</span></p>
        </div>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-kop-main transition-colors px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm active:scale-95"
        >
          <Icon name={showBalance ? "EyeOff" : "Eye"} size={16} />
          {showBalance ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-kop-500 to-kop-800 rounded-2xl p-6 text-white shadow-lg shadow-kop-main/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Icon name="Wallet" size={120} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Icon name="ArrowDownToLine" size={20} /></div>
              <p className="text-kop-50 font-medium tracking-wide">Saldo Simpanan</p>
            </div>
            <h2 className="text-4xl font-bold tracking-tight font-mono">{formatRp(user?.wallet?.savingsBalance)}</h2>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-slate-900/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Icon name="Landmark" size={120} /> 
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><Icon name="ArrowUpRight" size={20} /></div>
              <p className="text-slate-300 font-medium tracking-wide">Saldo Pinjaman Aktif</p>
            </div>
            <h2 className="text-4xl font-bold tracking-tight font-mono">{formatRp(user?.wallet?.loanBalance)}</h2>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};