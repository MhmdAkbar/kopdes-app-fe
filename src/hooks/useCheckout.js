// src/hooks/useCheckout.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { checkoutService } from '../services/checkoutService.js';
import { userService } from '../services/userService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

export const useCheckout = (onSuccessCallback) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setUser } = useAuth(); // Untuk update saldo di navbar/dashboard

  const handleCheckout = async (cartItems, paymentMethod) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Keranjang belanja kosong');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Memverifikasi transaksi dan stok...');
    
    // Generate UUIDv4 baru tepat saat tombol ditekan
    const idempotencyKey = uuidv4();

    // Mapping keranjang lokal ke format DTO Backend
    const payload = {
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await checkoutService.processCheckout(payload, idempotencyKey);
      
      // 1. Berikan notifikasi sukses
      toast.success('Pembayaran Berhasil! Pesanan diproses.', { id: toastId });

      // 2. Tarik ulang data Profile agar Saldo Simpanan/Pinjaman di UI terupdate
      try {
        const profileUpdate = await userService.getMe();
        if (profileUpdate.success) setUser(profileUpdate.data);
      } catch (e) {
        console.warn('Gagal memuat ulang saldo, tapi transaksi sukses');
      }

      // 3. Jalankan callback (misal untuk membersihkan keranjang & pindah halaman)
      if (onSuccessCallback) onSuccessCallback(response.data);

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan server';

      // PENANGANAN KHUSUS: Idempotency Duplicate Detection dari Backend
      if (errorMsg.includes('Duplicate request detected')) {
        toast.success('Pembayaran sudah berhasil diproses!', { id: toastId });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(`Transaksi Gagal: ${errorMsg}`, { id: toastId, duration: 4000 });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleCheckout, isProcessing };
};