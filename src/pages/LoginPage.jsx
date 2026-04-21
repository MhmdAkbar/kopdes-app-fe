// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { AuthLayout } from '../components/templates/AuthLayout.jsx';
import { LoginForm } from '../components/organisms/LoginForm.jsx';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (credentials) => {
    const toastId = toast.loading('Memproses kredensial...');
    try {
      await login(credentials);
      toast.success('Otentikasi berhasil!', { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login gagal. Periksa kembali nomor atau kata sandi Anda.';
      toast.error(message, { id: toastId });
    }
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLoginSubmit} />
    </AuthLayout>
  );
};