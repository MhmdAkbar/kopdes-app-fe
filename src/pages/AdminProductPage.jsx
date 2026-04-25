// src/pages/AdminProductPage.jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useProductManager } from '../hooks/useProductManager.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { ProductFormModal } from '../components/molecules/ProductFormModal.jsx';
import { ImageManagerModal } from '../components/molecules/ImageManagerModal.jsx';
import { ConfirmModal } from '../components/molecules/ConfirmModal.jsx';
import { Button } from '../components/atoms/Button.jsx';
import Icon from '../components/atoms/Icon.jsx';

export const AdminProductPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const { products, isLoading, refetch } = useProducts();
  const { isProcessing, handleCreate, handleUpdate, handleDelete, handleUploadImages, handleDeleteImage } = useProductManager(refetch);

  const [formModal, setFormModal] = useState({ isOpen: false, data: null });
  const [imageModal, setImageModal] = useState({ isOpen: false, product: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const formatRp = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

  const onSubmitForm = async (data) => {
    if (formModal.data) await handleUpdate(formModal.data.id, data);
    else await handleCreate(data);
    setFormModal({ isOpen: false, data: null });
  };

  const onConfirmDelete = async () => {
    await handleDelete(deleteModal.productId);
    setDeleteModal({ isOpen: false, productId: null });
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Inventaris Produk</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola data, stok, dan galeri produk toko.</p>
          </div>
          <Button onClick={() => setFormModal({ isOpen: true, data: null })} className="!w-auto flex items-center gap-2 px-5">
            <Icon name="Plus" size={18} /> Tambah Produk
          </Button>
        </header>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Nama Produk</th>
                <th className="p-4 font-semibold">Harga</th>
                <th className="p-4 font-semibold text-center">Stok</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Memuat data produk...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Inventaris kosong.</td></tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">
                      {prod.name}
                      <div className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                        <Icon name="Image" size={12} /> {prod.images?.length || 0}/5 Foto
                      </div>
                    </td>
                    <td className="p-4 text-kop-main font-semibold">{formatRp(prod.price)}</td>
                    <td className="p-4 text-center font-mono">{prod.stockQuantity}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${prod.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {prod.isActive ? 'Aktif' : 'Disembunyikan'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setImageModal({ isOpen: true, product: prod })} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Kelola Gambar">
                          <Icon name="Images" size={18} />
                        </button>
                        <button onClick={() => setFormModal({ isOpen: true, data: prod })} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Icon name="Edit3" size={18} />
                        </button>
                        <button onClick={() => setDeleteModal({ isOpen: true, productId: prod.id })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal isOpen={formModal.isOpen} onClose={() => setFormModal({ isOpen: false, data: null })} onSubmit={onSubmitForm} initialData={formModal.data} isProcessing={isProcessing} />
      <ImageManagerModal isOpen={imageModal.isOpen} onClose={() => setImageModal({ isOpen: false, product: null })} product={imageModal.product} onUpload={handleUploadImages} onDeleteImage={handleDeleteImage} isProcessing={isProcessing} />
      <ConfirmModal isOpen={deleteModal.isOpen} title="Sembunyikan Produk" message="Produk akan disembunyikan dari Member (Soft Delete) agar riwayat pesanan terjaga." icon="ArchiveX" isDanger={true} onConfirm={onConfirmDelete} onCancel={() => setDeleteModal({ isOpen: false, productId: null })} confirmText="Ya, Sembunyikan" />
    </DashboardLayout>
  );
};