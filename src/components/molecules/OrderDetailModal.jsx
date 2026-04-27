// src/components/molecules/OrderDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '../../services/orderService.js';
import Icon from '../atoms/Icon.jsx';
import toast from 'react-hot-toast';

export const OrderDetailModal = ({ isOpen, onClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const response = await orderService.getOrderById(orderId);
          if (response.success) setOrder(response.data);
        } catch (error) {
          toast.error("Gagal memuat detail pesanan");
          onClose();
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    } else {
      setOrder(null);
    }
  }, [isOpen, orderId, onClose]);

  const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icon name="ReceiptText" size={20} className="text-kop-main" /> Detail Faktur
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><Icon name="X" size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              {isLoading ? (
                <div className="py-20 text-center animate-pulse text-slate-400 font-medium">Memuat rincian...</div>
              ) : order && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">ID Pesanan</p>
                      <p className="font-mono text-sm text-slate-700">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Tanggal</p>
                      <p className="text-sm text-slate-700">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1 pr-4">
                          <p className="font-bold text-slate-800">{item.productName}</p>
                          <p className="text-slate-500 text-xs">{formatRp(item.unitPrice)} x {item.quantity}</p>
                        </div>
                        <p className="font-bold text-slate-700">{formatRp(item.subTotal)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-5 text-white">
                    <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
                      <span>Metode: {order.paymentMethod === 'SAVINGS' ? 'Simpanan' : 'Potong Kasbon'}</span>
                      <span className={`font-bold ${order.status === 'COMPLETED' ? 'text-emerald-400' : order.status === 'PENDING' ? 'text-amber-400' : 'text-red-400'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-3">
                      <span className="font-medium">Total Bayar</span>
                      <span className="text-xl font-black text-kop-400">{formatRp(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};