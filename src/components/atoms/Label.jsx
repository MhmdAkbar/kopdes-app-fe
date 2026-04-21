// src/components/atoms/Label.jsx
import React from 'react';

export const Label = ({ children, htmlFor, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-700 mb-1.5 ${className}`}>
      {children}
    </label>
  );
};