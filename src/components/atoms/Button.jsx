// src/components/atoms/Button.jsx
import React from 'react';

/**
 * Button Atom
 * Standardized button component with multiple variants.
 */
export const Button = ({ children, type = 'button', variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'w-full font-semibold py-2.5 rounded-lg transition-all duration-200 outline-none active:scale-[0.98]';
  const variants = {
    primary: 'bg-kop-main hover:bg-kop-dark text-white shadow-sm',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm', // Added danger variant
  };

  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};