// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { useCheckout } from '../hooks/useCheckout.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { Button } from '../components/atoms/Button.jsx';
import Icon from '../components/atoms/Icon.jsx'; // <--- SUDAH DIPERBAIKI

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('SAVINGS');

  const onCheckoutSuccess = () => {
    clearCart();
    navigate('/dashboard', { replace: true }); 
  };

  const { handleCheckout, isProcessing } = useCheckout(onCheckoutSuccess);

  const formatRp = (value) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  const totalBelanja = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const saldoSimpanan = user?.wallet?.savingsBalance || 0;
  const isSaldoCukup = paymentMethod === 'SAVINGS' ? saldoSimpanan >= totalBelanja : true;

  if (cartItems.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="ShoppingCart" size={48} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Keranjang Kosong</h2>
          <p className="text-slate-500 mt-2">Anda belum memilih barang untuk dibeli.</p>
          <Button onClick={() => navigate('/catalog')} className="mt-8 !w-auto px-8">Mulai Belanja</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Checkout Pesanan</h1>
          <p className="text-slate-500">Selesaikan pembayaran untuk pesanan Anda.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Barang */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Icon name="ShoppingBag" size={20} className="text-kop-main" /> Daftar Belanja
              </h3>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-base">{item.name}</p>
                      <p className="text-sm font-semibold text-kop-main">{formatRp(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Kontrol Jumlah */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-slate-50 text-slate-500 transition-colors"
                        >
                          <Icon name="Minus" size={16} />
                        </button>
                        <span className="px-4 font-bold text-slate-700 min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-slate-50 text-slate-500 transition-colors"
                        >
                          <Icon name="Plus" size={16} />
                        </button>
                      </div>

                      {/* Tombol Hapus */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Icon name="Trash2" size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Icon name="CreditCard" size={20} className="text-kop-main" /> Metode Pembayaran
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative cursor-pointer border-2 rounded-2xl p-5 transition-all ${paymentMethod === 'SAVINGS' ? 'border-kop-main bg-kop-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="SAVINGS" checked={paymentMethod === 'SAVINGS'} onChange={() => setPaymentMethod('SAVINGS')} className="text-kop-main focus:ring-kop-main w-5 h-5" />
                      <span className="font-bold text-slate-800">Saldo Simpanan</span>
                    </div>
                    <Icon name="PiggyBank" size={24} className={paymentMethod === 'SAVINGS' ? 'text-kop-main' : 'text-slate-300'} />
                  </div>
                  <p className="text-sm text-slate-500 ml-8">Tersedia: <span className="font-bold text-slate-700">{formatRp(saldoSimpanan)}</span></p>
                </label>

                <label className={`relative cursor-pointer border-2 rounded-2xl p-5 transition-all ${paymentMethod === 'LOAN' ? 'border-kop-main bg-kop-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="LOAN" checked={paymentMethod === 'LOAN'} onChange={() => setPaymentMethod('LOAN')} className="text-kop-main focus:ring-kop-main w-5 h-5" />
                      <span className="font-bold text-slate-800">Potong Kasbon</span>
                    </div>
                    <Icon name="Receipt" size={24} className={paymentMethod === 'LOAN' ? 'text-kop-main' : 'text-slate-300'} />
                  </div>
                  <p className="text-sm text-slate-500 ml-8 font-medium">Bayar nanti di akhir bulan.</p>
                </label>
              </div>
              
              {!isSaldoCukup && paymentMethod === 'SAVINGS' && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-start gap-3 border border-red-100">
                  <Icon name="AlertCircle" size={20} className="shrink-0" />
                  <p className="leading-relaxed">Saldo simpanan Anda tidak mencukupi. Silakan gunakan metode <b>Potong Kasbon</b> atau kurangi jumlah belanjaan Anda.</p>
                </div>
              )}
            </div>
          </div>

          {/* Ringkasan & Tombol Bayar */}
          <div className="relative">
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white sticky top-24 border border-white/10">
              <h3 className="font-bold text-xl mb-6 text-slate-100 border-b border-white/10 pb-4">Ringkasan</h3>
              
              <div className="space-y-4 mb-8 text-slate-400 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal Barang</span>
                  <span className="text-slate-100 font-medium">{formatRp(totalBelanja)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Administrasi</span>
                  <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Gratis</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-medium text-sm">Total Tagihan</span>
                  <span className="text-3xl font-black text-white tracking-tight">{formatRp(totalBelanja)}</span>
                </div>
              </div>

              <Button 
                onClick={() => handleCheckout(cartItems, paymentMethod)}
                disabled={isProcessing || (!isSaldoCukup && paymentMethod === 'SAVINGS')}
                className="w-full !py-5 text-lg font-bold bg-kop-main hover:bg-kop-600 border-none flex items-center justify-center gap-3 shadow-lg shadow-kop-main/20"
              >
                {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                {!isProcessing && <Icon name="ShieldCheck" size={22} />}
              </Button>
              <p className="text-[10px] text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
                <Icon name="Lock" size={10} /> Transaksi Anda diamankan oleh sistem koperasi
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};