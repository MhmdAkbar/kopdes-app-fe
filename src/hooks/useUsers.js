// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService.js';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data pengguna.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (userData, onSuccess) => {
    setIsProcessing(true);
    const toastId = toast.loading('Mendaftarkan anggota baru...');
    try {
      await userService.createUser(userData);
      toast.success('Anggota berhasil didaftarkan!', { id: toastId });
      fetchUsers(); // Refresh tabel
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftar anggota.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'mengaktifkan' : 'menonaktifkan';
    
    setIsProcessing(true);
    const toastId = toast.loading(`Sedang ${action} akun...`);
    try {
      await userService.updateUserStatus(userId, newStatus);
      toast.success(`Akun berhasil di${newStatus ? 'aktifkan' : 'nonaktifkan'}.`, { id: toastId });
      fetchUsers(); // Refresh tabel
    } catch (error) {
      toast.error(error.response?.data?.message || `Gagal ${action} akun.`, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    users, 
    isLoading, 
    isProcessing, 
    handleCreateUser, 
    handleToggleStatus 
  };
};