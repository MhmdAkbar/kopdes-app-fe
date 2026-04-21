// src/components/templates/AuthLayout.jsx
import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kop-50 p-4 selection:bg-kop-main selection:text-white">
      {children}
    </div>
  );
};