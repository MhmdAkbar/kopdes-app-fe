// src/components/organisms/Navigation.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Icon from '../atoms/Icon.jsx';
import { ConfirmModal } from '../molecules/ConfirmModal.jsx';

const DesktopSidebar = ({ navItems, onLogoutClick }) => (
  <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed top-0 left-0 z-20">
    <div className="p-6 border-b border-slate-800 text-center flex items-center gap-3 justify-center">
      <Icon name="Leaf" className="text-kop-main" size={28} />
      <h2 className="font-bold text-lg tracking-wide">Smart Koperasi</h2>
    </div>
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${
              isActive ? 'bg-kop-main text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`
          }
        >
          <Icon name={item.icon} className="w-6" />
          <span className="font-medium ml-3">{item.label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="p-4 border-t border-slate-800">
      <button
        onClick={onLogoutClick}
        className="flex items-center w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 active:scale-95"
      >
        <Icon name="LogOut" className="w-6" />
        <span className="font-medium ml-3">Keluar</span>
      </button>
    </div>
  </aside>
);

const MobileBottomNav = ({ navItems, onLogoutClick }) => (
  <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
    {navItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 active:bg-slate-50 ${
            isActive ? 'text-kop-main' : 'text-slate-400'
          }`
        }
      >
        <Icon name={item.icon} size={22} className="mb-1" />
        <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
      </NavLink>
    ))}
    <button
      onClick={onLogoutClick}
      className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-slate-400 hover:text-red-500 transition-all duration-200 active:bg-slate-50"
    >
      <Icon name="LogOut" size={22} className="mb-1" />
      <span className="text-[10px] font-bold tracking-wide">Keluar</span>
    </button>
  </nav>
);

export const Navigation = () => {
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const navItems = [
    { path: '/dashboard', label: 'Saldo', icon: 'Wallet' },
    { path: '/catalog', label: 'Katalog', icon: 'Store' },
    { path: '/orders', label: 'Riwayat', icon: 'History' },
    { path: '/profile', label: 'Profil', icon: 'User' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin/products', label: 'Produk', icon: 'PackageOpen' });
    navItems.push({ path: '/admin/users', label: 'Anggota', icon: 'Users' });
  }

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <>
      <DesktopSidebar navItems={navItems} onLogoutClick={() => setIsLogoutModalOpen(true)} />
      <MobileBottomNav navItems={navItems} onLogoutClick={() => setIsLogoutModalOpen(true)} />
      
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        title="Keluar dari Sistem"
        message="Apakah Anda yakin ingin mengakhiri sesi dan keluar dari aplikasi Smart Koperasi?"
        icon="LogOut"
        isDanger={true}
        confirmText="Ya, Keluar"
        cancelText="Batal"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};