// src/pages/CatalogPage.jsx
import React from 'react';
import { useProducts } from '../hooks/useProducts.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { ProductCard } from '../components/molecules/ProductCard.jsx';
import Icon from '../components/atoms/Icon.jsx';

export const CatalogPage = () => {
  const { products, isLoading, error } = useProducts();

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Katalog Koperasi</h1>
        <p className="text-slate-500 mt-1">Penuhi kebutuhan pertanian dan harian Anda.</p>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-[400px] border border-slate-100 shadow-sm animate-pulse flex flex-col">
              <div className="h-48 bg-slate-200"></div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="mt-auto h-10 bg-slate-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
          <Icon name="AlertCircle" size={32} className="mx-auto mb-2 opacity-80" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-4">
            <Icon name="PackageOpen" size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Katalog Kosong</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Saat ini belum ada produk yang tersedia atau aktif di koperasi. Silakan periksa kembali nanti.</p>
        </div>
      )}

      {/* Data Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};