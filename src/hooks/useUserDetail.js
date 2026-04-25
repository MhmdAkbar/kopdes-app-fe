// src/hooks/useUserDetail.js
import { useState, useEffect } from 'react';
import { userService } from '../services/userService.js';
import toast from 'react-hot-toast';

export const useUserDetail = (userId) => {
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Jika modal ditutup (userId null), bersihkan state
    if (!userId) {
      setUserDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getUserById(userId);
        if (response.success) {
          setUserDetail(response.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal memuat detail pengguna.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [userId]);

  return { userDetail, isLoading };
};