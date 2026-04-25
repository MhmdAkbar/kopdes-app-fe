// src/utils/iconMapper.jsx
import React from 'react';
import Icon from '../components/atoms/Icon.jsx';

export const getProductIconProps = (productName = "") => {
  const name = productName.toLowerCase();

  // Kategori Pangan / Beras
  if (name.includes('beras') || name.includes('gandum') || name.includes('padi')) {
    return { name: 'Wheat', color: 'text-amber-500', bg: 'bg-amber-50' };
  }
  // Kategori Material / Kemasan
  if (name.includes('pupuk') || name.includes('semen')) {
    return { name: 'Package', color: 'text-slate-500', bg: 'bg-slate-100' };
  }
  // Kategori Bibit / Tanaman
  if (name.includes('bibit') || name.includes('benih')) {
    return { name: 'Sprout', color: 'text-emerald-500', bg: 'bg-emerald-50' };
  }
  // Kategori Alat Tani
  if (name.includes('alat') || name.includes('traktor') || name.includes('cangkul')) {
    return { name: 'Wrench', color: 'text-slate-600', bg: 'bg-slate-100' };
  }
  // Kategori Cairan / Obat
  if (name.includes('racun') || name.includes('pestisida') || name.includes('cair')) {
    return { name: 'FlaskConical', color: 'text-purple-500', bg: 'bg-purple-50' };
  }

  // Fallback default icon
  return { name: 'Box', color: 'text-kop-main', bg: 'bg-kop-50' };
};

export const RenderProductIcon = ({ productName, size = 24, className = "" }) => {
  const iconProps = getProductIconProps(productName);
  return (
    <Icon 
      name={iconProps.name} 
      size={size} 
      className={`${iconProps.color} ${className}`} 
    />
  );
};