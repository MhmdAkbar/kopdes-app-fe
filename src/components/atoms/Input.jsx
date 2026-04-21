// src/components/atoms/Input.jsx
import React from 'react';

export const Input = ({ hasIcon = false, className = '', ...props }) => {
  const paddingLeft = hasIcon ? 'pl-10' : 'pl-4';
  return (
    <input 
      className={`w-full ${paddingLeft} py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 ${className}`} 
      {...props} 
    />
  );
};