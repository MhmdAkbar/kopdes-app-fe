// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { useCheckout } from '../hooks/useCheckout.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { Button } from '../components/atoms/Button.jsx';
import Icon from '../components/atoms/Icon.jsx';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('SAVINGS');

  const onCheckoutSuccess = () => {
    clearCart();
    navigate('/orders', { replace: true }); 
  };

  const { handleCheckout, isProcessing } = useCheckout(onCheckoutSuccess);

  const formatRp = (value) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  const totalBelanja = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const saldoSimpanan = user?.wallet?.savingsBalance || 0;
  const saldoPinjaman = user?.wallet?.loanBalance || 0;
  
  const isSaldoCukup = paymentMethod === 'SAVINGS' ? saldoSimpanan >= totalBelanja : saldoPinjaman >= totalBelanja;

  if (cartItems.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 md:py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
          <div className="bg-slate-50 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="ShoppingCart" size={40} className="text-slate-300" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Keranjang Kosong</h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Anda belum memilih barang untuk dibeli.</p>
          <Button onClick={() => navigate('/catalog')} className="mt-8 !w-full md:!w-auto px-8">Mulai Belanja</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-2 md:px-0">
        <header className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Checkout Pesanan</h1>
          <p className="text-sm md:text-base text-slate-500">Selesaikan pembayaran untuk pesanan Anda.</p>
        </header>
        
        {/* Container Utama: Flex-col di Mobile, Grid di Desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* SISI KIRI: Daftar Barang & Metode (Order-2 di Mobile agar Ringkasan di Atas) */}
          <div className="w-full order-2 lg:order-1 lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Icon name="ShoppingBag" size={20} className="text-kop-main" /> Daftar Belanja
              </h3>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 gap-4 transition-all hover:bg-slate-50">
                    <div className="flex-1 w-full min-w-0">
                      <p className="font-bold text-slate-800 text-sm md:text-base truncate sm:whitespace-normal">{item.name}</p>
                      <p className="text-xs md:text-sm font-semibold text-kop-main">{formatRp(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 md:p-2 hover:bg-slate-50 text-slate-500">
                          <Icon name="Minus" size={14} />
                        </button>
                        <span className="px-3 font-bold text-slate-700 min-w-[32px] text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 md:p-2 hover:bg-slate-50 text-slate-500">
                          <Icon name="Plus" size={14} />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Icon name="CreditCard" size={20} className="text-kop-main" /> Metode Pembayaran
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SAVINGS */}
                <label className={`relative cursor-pointer border-2 rounded-2xl p-4 md:p-5 transition-all ${paymentMethod === 'SAVINGS' ? 'border-kop-main bg-kop-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="SAVINGS" checked={paymentMethod === 'SAVINGS'} onChange={() => setPaymentMethod('SAVINGS')} className="text-kop-main focus:ring-kop-main w-4 h-4 md:w-5 md:h-5" />
                      <span className="font-bold text-slate-800 text-sm md:text-base">Dompet Utama</span>
                    </div>
                    <Icon name="Wallet" size={20} className={paymentMethod === 'SAVINGS' ? 'text-kop-main' : 'text-slate-300'} />
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 ml-7 md:ml-8">Tersedia: <span className={`font-bold ${saldoSimpanan < totalBelanja && paymentMethod === 'SAVINGS' ? 'text-red-500' : 'text-slate-700'}`}>{formatRp(saldoSimpanan)}</span></p>
                </label>

                {/* LOAN */}
                <label className={`relative cursor-pointer border-2 rounded-2xl p-4 md:p-5 transition-all ${paymentMethod === 'LOAN' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="LOAN" checked={paymentMethod === 'LOAN'} onChange={() => setPaymentMethod('LOAN')} className="text-blue-500 focus:ring-blue-500 w-4 h-4 md:w-5 md:h-5" />
                      <span className="font-bold text-slate-800 text-sm md:text-base">Dana Pinjaman</span>
                    </div>
                    <Icon name="HandCoins" size={20} className={paymentMethod === 'LOAN' ? 'text-blue-500' : 'text-slate-300'} />
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 ml-7 md:ml-8">Tersedia: <span className={`font-bold ${saldoPinjaman < totalBelanja && paymentMethod === 'LOAN' ? 'text-red-500' : 'text-slate-700'}`}>{formatRp(saldoPinjaman)}</span></p>
                </label>
              </div>
              
              {!isSaldoCukup && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[13px] md:text-sm flex items-start gap-3 border border-red-100">
                  <Icon name="AlertCircle" size={18} className="shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">Saldo tidak mencukupi untuk metode ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* SISI KANAN: Ringkasan (Order-1 di Mobile agar user langsung lihat Total) */}
          <div className="w-full order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-xl text-white border border-white/10">
              <h3 className="font-bold text-lg md:text-xl mb-6 text-slate-100 border-b border-white/10 pb-4">Ringkasan</h3>
              
              <div className="space-y-4 mb-6 md:mb-8 text-slate-400 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span>Subtotal Barang</span>
                  <span className="text-slate-100 font-medium">{formatRp(totalBelanja)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Biaya Administrasi</span>
                  <span className="text-emerald-400 font-bold uppercase text-[9px] md:text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Gratis</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6 mb-8 md:mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-medium text-xs md:text-sm">Total Tagihan</span>
                  <span className="text-2xl md:text-xl font-black text-white tracking-tight">{formatRp(totalBelanja)}</span>
                </div>
              </div>

              <Button 
                onClick={() => handleCheckout(cartItems, paymentMethod)}
                disabled={isProcessing || !isSaldoCukup}
                className={`w-full !py-4 md:!py-5 text-base md:text-lg font-bold border-none flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 ${paymentMethod === 'LOAN' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-kop-main hover:bg-kop-600 shadow-kop-main/20'}`}
              >
                {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                {!isProcessing && <Icon name="ShieldCheck" size={20} />}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};