// src/components/molecules/ProductCard.jsx
import React, { useState, useEffect } from "react";
import { getProductIconProps, RenderProductIcon } from "../../utils/iconMapper.jsx";
import { Button } from "../atoms/Button.jsx";
import Icon from "../atoms/Icon.jsx";
import { useCart } from "../../contexts/CartContext.jsx";

export const ProductCard = ({ product }) => {
  // 1. AMBIL FUNGSI DARI HOOK (Ini yang menyebabkan error tadi)
  const { addToCart } = useCart();

  // 2. PERBAIKAN SERVER_URL MENGGUNAKAN .env
  // Mengubah "http://localhost:3000/api/v1" menjadi "http://localhost:3000"
  const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api/v1", "");

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasImage = product.images && product.images.length > 0;
  const isMultipleImages = product.images && product.images.length > 1;
  const fallbackStyle = getProductIconProps(product.name);

  useEffect(() => {
    if (!isMultipleImages || isHovered) return;
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isMultipleImages, isHovered, product.images?.length]);

  const formatRp = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIdx((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${!product.isAvailable ? "opacity-70 grayscale-[50%]" : ""}`}>
      
      <div
        className={`h-48 relative flex items-center justify-center overflow-hidden group ${hasImage ? "bg-slate-50" : fallbackStyle.bg}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {hasImage ? (
          <>
            <div
              className="flex w-full h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIdx * 100}%)` }}
            >
              {product.images.map((img, idx) => (
                <img
                  key={img.id || idx}
                  src={`${SERVER_URL}${img.imageUrl}`}
                  alt={`${product.name} - ${idx + 1}`}
                  className="w-full h-full object-cover shrink-0"
                />
              ))}
            </div>

            {isMultipleImages && (
              <>
                <button onClick={prevImage} className="absolute left-2 p-1.5 rounded-full bg-white/80 text-slate-800 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm z-20">
                  <Icon name="ChevronLeft" size={18} />
                </button>
                <button onClick={nextImage} className="absolute right-2 p-1.5 rounded-full bg-white/80 text-slate-800 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm z-20">
                  <Icon name="ChevronRight" size={18} />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {product.images.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIdx ? "w-4 bg-kop-main shadow-sm" : "w-1.5 bg-white/70"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <RenderProductIcon productName={product.name} size={64} className="opacity-40" />
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute top-3 right-3 z-10 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Stok Habis
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col z-10 bg-white relative">
        <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Harga</p>
            <p className="text-kop-main font-bold text-xl tracking-tight">{formatRp(product.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Sisa Stok</p>
            <p className="text-slate-700 font-bold">{product.stockQuantity}</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100">
          <Button
            variant={product.isAvailable ? "primary" : "secondary"}
            disabled={!product.isAvailable}
            onClick={(e) => {
              e.preventDefault(); // Mencegah bubbling jika card bisa diklik
              addToCart(product);
            }}
            className="flex items-center justify-center gap-2"
          >
            <Icon name="ShoppingCart" size={18} />
            {product.isAvailable ? "Tambah ke Keranjang" : "Tidak Tersedia"}
          </Button>
        </div>
      </div>
    </div>
  );
};