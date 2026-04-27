// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService.js';
import toast from 'react-hot-toast';

export const useOrders = (initialLimit = 10) => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: initialLimit,
        status: statusFilter || undefined
      };
      
      const response = await orderService.getAllOrders(params);
      if (response.success) {
        setOrders(response.data.items);
        setMeta(response.data.meta);
      }
    } catch (error) {
      toast.error('Gagal memuat riwayat pesanan');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, initialLimit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  const changeStatus = (status) => {
    setStatusFilter(status);
    setPage(1); // Reset ke halaman 1 saat filter berubah
  };

  return { 
    orders, 
    meta, 
    page, 
    statusFilter, 
    isLoading, 
    changePage, 
    changeStatus,
    refetch: fetchOrders 
  };
};