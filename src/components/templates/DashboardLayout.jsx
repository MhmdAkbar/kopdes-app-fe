// src/components/templates/DashboardLayout.jsx
import { Navigation } from '../organisms/Navigation.jsx';
import { PageTransition } from '../atoms/PageTransition.jsx';
import { useCart } from '../../contexts/CartContext.jsx'; // <--- IMPORT INI
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../atoms/Icon.jsx';

export const DashboardLayout = ({ children }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Hitung total barang di keranjang
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-bg-base flex selection:bg-kop-main selection:text-white relative">
      <Navigation />
      <main className="flex-1 md:ml-64 pb-24 md:pb-8 p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* FLOATING CART BUTTON (Tampil jika ada barang & bukan di halaman checkout) */}
      {totalItems > 0 && location.pathname !== '/checkout' && (
        <button
          onClick={() => navigate('/checkout')}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 bg-kop-main text-white p-4 rounded-full shadow-2xl hover:bg-kop-600 hover:scale-105 transition-all z-50 flex items-center justify-center animate-bounce-short"
        >
          <div className="relative">
            <Icon name="ShoppingCart" size={28} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {totalItems}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};