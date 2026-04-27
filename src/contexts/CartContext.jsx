// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fungsi menambah barang (dari katalog)
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        toast.error(`Stok maksimal ${product.name} adalah ${product.stockQuantity}`);
        return; 
      }
      toast.success(`Menambah kuantitas ${product.name}`);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      toast.success(`${product.name} dimasukkan ke keranjang`);
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  // FUNGSI BARU: Update kuantitas (+1 atau -1)
  const updateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          // Validasi stok saat ditambah
          if (delta > 0 && newQty > item.stockQuantity) {
            toast.error("Stok tidak mencukupi");
            return item;
          }
          // Jangan biarkan kurang dari 1
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    toast.success("Barang dihapus dari keranjang");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};