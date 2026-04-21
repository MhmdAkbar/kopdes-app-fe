// src/pages/CreateUserPage.jsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService } from '../services/userService.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { InputField } from '../components/molecules/InputField.jsx';
import { Button } from '../components/atoms/Button.jsx';
import toast from 'react-hot-toast';

export const CreateUserPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    role: 'MEMBER'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Mendaftarkan anggota...');

    try {
      const response = await userService.createUser(formData);
      if (response.success) {
        toast.success('Anggota baru berhasil didaftarkan.', { id: toastId });
        setFormData({ name: '', phoneNumber: '', password: '', role: 'MEMBER' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftarkan anggota.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto">
        <header className="mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Registrasi Anggota</h2>
          <p className="text-sm text-slate-500 mt-1">Buat kredensial akses untuk anggota koperasi baru.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="name"
            label="Nama Lengkap"
            icon="User"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <InputField
            id="phoneNumber"
            label="Nomor WhatsApp"
            icon="Phone"
            type="tel"
            inputMode="numeric"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <InputField
            id="password"
            label="Kata Sandi Awal"
            type="password"
            icon="Lock"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">Peran Akses (Role)</label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none bg-white transition-all disabled:bg-slate-50"
            >
              <option value="MEMBER">Anggota (Member)</option>
              {user?.role === 'SUPER_ADMIN' && <option value="ADMIN">Administrator</option>}
            </select>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-50">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Daftarkan Anggota'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};