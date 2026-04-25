// src/components/molecules/ImageManagerModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../atoms/Button.jsx';
import Icon from '../atoms/Icon.jsx';
import toast from 'react-hot-toast';

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2;

export const ImageManagerModal = ({ isOpen, onClose, product, isProcessing, onUpload, onDeleteImage }) => {
  const fileInputRef = useRef(null);
  const [stagedFiles, setStagedFiles] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  // Clear stage when modal closes
  useEffect(() => { if (!isOpen) setStagedFiles([]); }, [isOpen]);

  if (!product) return null;
  const existingImages = product.images || [];
  const totalImages = existingImages.length + stagedFiles.length;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (totalImages + files.length > MAX_IMAGES) {
      toast.error(`Maksimal ${MAX_IMAGES} gambar per produk.`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`File "${file.name}" > ${MAX_SIZE_MB}MB.`);
        return false;
      }
      return true;
    });

    const newStagedFiles = validFiles.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setStagedFiles(prev => [...prev, ...newStagedFiles]);
    e.target.value = ''; 
  };

  const handleUploadSubmit = async () => {
    if (stagedFiles.length === 0) return;
    const filesToUpload = stagedFiles.map(s => s.file);
    await onUpload(product.id, filesToUpload);
    setStagedFiles([]); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={!isProcessing ? onClose : undefined} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { type: 'spring', damping: 25 } }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Galeri: {product.name}</h3>
                <p className="text-sm text-slate-500">{totalImages} / {MAX_IMAGES} Gambar terisi</p>
              </div>
              <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-slate-600">
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-50/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {/* Existing Images */}
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <img src={`${BASE_URL}${img.imageUrl}`} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => onDeleteImage(img.id)} disabled={isProcessing} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg">
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Staged Images */}
                {stagedFiles.map((staged, idx) => (
                  <div key={idx} className="relative aspect-square bg-white rounded-xl border-2 border-kop-main/50 overflow-hidden opacity-70">
                    <img src={staged.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setStagedFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-slate-900/70 text-white p-1 rounded-full hover:bg-red-500">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {totalImages < MAX_IMAGES && (
                  <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-kop-main hover:border-kop-main hover:bg-kop-50 transition-all">
                    <Icon name="Plus" size={32} className="mb-2" />
                    <span className="text-xs font-medium">Pilih Foto</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/jpeg, image/png, image/webp" multiple className="hidden" />
              </div>

              {/* Upload Action */}
              <AnimatePresence>
                {stagedFiles.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-kop-50 border border-kop-200 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm text-kop-800 font-medium">Ada {stagedFiles.length} foto baru siap diunggah.</span>
                    <Button onClick={handleUploadSubmit} disabled={isProcessing} className="!w-auto px-6 flex items-center justify-center gap-2">
                      <Icon name="Upload" size={18} /> Unggah
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};