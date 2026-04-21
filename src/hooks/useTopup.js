// src/hooks/useTopup.js
import { useState } from 'react';
import { paymentService } from '../services/paymentService.js';
import { userService } from '../services/userService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export const useTopup = (onSuccessCallback) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setUser } = useAuth(); // Ambil fungsi untuk update data user di state global

  const handleTopup = async (amountString) => {
    // Hilangkan titik/koma sebelum dikirim ke BE
    const amount = Number(amountString.replace(/\D/g, ''));

    if (!amount || amount < 10000) {
      toast.error('Minimal top-up adalah Rp 10.000');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Memproses transaksi...');

    try {
      const response = await paymentService.initiateTopup(amount);
      
      if (response.success && response.data?.paymentUrl) {
        const url = response.data.paymentUrl;

        // CEK: Jika ini adalah URL simulasi dari backend lokal kita
        if (url.includes('simulate-success')) {
          toast.loading('Menyimulasikan pembayaran gateway...', { id: toastId });
          
          // 1. Tembak endpoint simulasi secara sembunyi-sembunyi
          await api.get(url);
          
          // 2. Tarik ulang data profil terbaru (karena saldo di BE sudah bertambah)
          const updatedProfile = await userService.getMe();
          
          // 3. Update state global (otomatis merubah angka di Dashboard)
          if (updatedProfile.success) {
            setUser(updatedProfile.data);
          }

          toast.success('Top-up berhasil! Saldo bertambah.', { id: toastId });
          
          // 4. Tutup modal
          if (onSuccessCallback) onSuccessCallback();
          
        } else {
          // Jika Production (Midtrans asli), arahkan ke halaman pembayaran
          toast.success('Mengarahkan ke Payment Gateway...', { id: toastId });
          window.location.href = url;
        }
      } else {
        throw new Error('URL Pembayaran tidak diterbitkan oleh server');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Gagal memproses top-up.';
      toast.error(message, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleTopup, isProcessing };
};