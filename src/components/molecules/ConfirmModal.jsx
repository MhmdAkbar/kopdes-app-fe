// src/components/molecules/ConfirmModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Gunakan Framer Motion
import { Button } from '../atoms/Button.jsx';
import Icon from '../atoms/Icon.jsx';

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  icon = 'AlertCircle',
  isDanger = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop/Overlay - Animasi Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container - Animasi Scale & Slide Up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { type: 'spring', damping: 25, stiffness: 300 } 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 10,
              transition: { duration: 0.2 } 
            }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10"
          >
            <div className="p-8 text-center">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${
                isDanger ? 'bg-red-50 text-red-500' : 'bg-kop-50 text-kop-main'
              }`}>
                <Icon name={icon} size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {message}
              </p>
              
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onCancel} className="!py-3">
                  {cancelText}
                </Button>
                <Button 
                  variant={isDanger ? 'danger' : 'primary'} 
                  onClick={onConfirm}
                  className="!py-3"
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};