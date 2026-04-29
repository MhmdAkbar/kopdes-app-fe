// src/components/organisms/Navigation.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Icon from '../atoms/Icon.jsx';
import { ConfirmModal } from '../molecules/ConfirmModal.jsx';

const DesktopSidebar = ({ navItems, adminItems, onLogoutClick }) => (
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

      {adminItems.length > 0 && (
        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin</p>
          {adminItems.map((item) => (
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
        </div>
      )}
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

const MobileHeader = ({ onMenuClick }) => (
  <header className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-slate-200 flex justify-between items-center p-4 z-30 shadow-sm">
    <div className="flex items-center gap-2">
      <Icon name="Leaf" className="text-kop-main" size={24} />
      <h1 className="font-bold text-slate-800 text-lg">Smart Koperasi</h1>
    </div>
    <button 
      onClick={onMenuClick}
      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
      aria-label="Open Menu"
    >
      <Icon name="Menu" size={24} />
    </button>
  </header>
);

const MobileDrawer = ({ isOpen, onClose, secondaryItems, adminItems, onLogoutClick }) => (
  <>
    {isOpen && (
      <div 
        className="md:hidden fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
        onClick={onClose}
      />
    )}
    <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex justify-between items-center p-5 border-b border-slate-100">
        <span className="font-semibold text-slate-800">Menu Pilihan</span>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <Icon name="X" size={24} />
        </button>
      </div>
      
      <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
        {secondaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-kop-main/10 text-kop-main font-medium' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <Icon name={item.icon} className="w-5" />
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}

        {adminItems.length > 0 && (
          <div className="mt-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin</p>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'bg-kop-main/10 text-kop-main font-medium' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon name={item.icon} className="w-5" />
                <span className="ml-3">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-white">
        <button
          onClick={() => {
            onClose();
            onLogoutClick();
          }}
          className="flex items-center w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
        >
          <Icon name="LogOut" className="w-5" />
          <span className="ml-3">Keluar</span>
        </button>
      </div>
    </div>
  </>
);

const MobileBottomNav = ({ primaryItems }) => (
  <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
    {primaryItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 h-14 rounded-xl transition-all duration-200 active:bg-slate-50 ${
            isActive ? 'text-kop-main' : 'text-slate-400'
          }`
        }
      >
        <Icon name={item.icon} size={24} className="mb-1" />
        <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
      </NavLink>
    ))}
  </nav>
);

export const Navigation = () => {
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const primaryNavItems = [
    { path: '/dashboard', label: 'Saldo', icon: 'Wallet' },
    { path: '/catalog', label: 'Katalog', icon: 'Store' },
    { path: '/rencanaku', label: 'Rencanaku', icon: 'HandCoins' },
  ];

  const secondaryNavItems = [
    { path: '/orders', label: 'Riwayat', icon: 'History' },
    { path: '/profile', label: 'Profil', icon: 'User' },
  ];

  const adminNavItems = isAdmin ? [
    { path: '/admin/products', label: 'Produk', icon: 'PackageOpen' },
    { path: '/admin/users', label: 'Anggota', icon: 'Users' },
  ] : [];

  const desktopNavItems = [...primaryNavItems, ...secondaryNavItems];

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <>
      <DesktopSidebar 
        navItems={desktopNavItems} 
        adminItems={adminNavItems}
        onLogoutClick={() => setIsLogoutModalOpen(true)} 
      />
      
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      <MobileDrawer 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        secondaryItems={secondaryNavItems}
        adminItems={adminNavItems}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      <MobileBottomNav primaryItems={primaryNavItems} />
      
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