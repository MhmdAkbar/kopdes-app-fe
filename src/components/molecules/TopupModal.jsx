// src/components/molecules/TopupModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../atoms/Button.jsx';
import { InputField } from './InputField.jsx';
import Icon from '../atoms/Icon.jsx';

// Pilihan nominal cepat
const PRESET_AMOUNTS = [50000, 100000, 250000, 500000];

export const TopupModal = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const [amount, setAmount] = useState('');

  // Reset form saat modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) setAmount('');
  }, [isOpen]);

  // Formatter untuk mengubah 100000 menjadi 100.000
  const handleAmountChange = (e) => {
    // Hanya izinkan angka, buang karakter lain
    const rawValue = e.target.value.replace(/\D/g, '');
    
    // Format ke standar Indonesia (titik sebagai pemisah ribuan)
    const formattedValue = rawValue ? new Intl.NumberFormat('id-ID').format(rawValue) : '';
    setAmount(formattedValue);
  };

  const handlePresetClick = (presetValue) => {
    setAmount(new Intl.NumberFormat('id-ID').format(presetValue));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim value yang sudah ada (di useTopup titiknya akan dibersihkan kembali)
    onSubmit(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Top Up Saldo</h3>
                <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-slate-600 transition-colors outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-kop-main">
                  <Icon name="X" size={24} />
                </button>
              </div>

              {/* Quick Nominal Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {PRESET_AMOUNTS.map((preset) => {
                  const formattedPreset = new Intl.NumberFormat('id-ID').format(preset);
                  const isSelected = amount === formattedPreset;
                  
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handlePresetClick(preset)}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-kop-main/50 active:scale-95 ${
                        isSelected
                          ? 'border-kop-main bg-kop-50 text-kop-main shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-kop-main/50 hover:bg-slate-50'
                      }`}
                    >
                      Rp {formattedPreset}
                    </button>
                  );
                })}
              </div>
              
              <form onSubmit={handleSubmit}>
                <InputField
                  id="amount"
                  label="Atau Ketik Nominal (Rp)"
                  icon="Banknote"
                  type="text" // Harus text agar format titik bisa dibaca
                  inputMode="numeric"
                  placeholder="Contoh: 50.000"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={isProcessing}
                  required
                />
                
                <div className="mt-8">
                  <Button type="submit" disabled={isProcessing || !amount}>
                    {isProcessing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};