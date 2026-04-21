// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService } from '../services/userService.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { InputField } from '../components/molecules/InputField.jsx';
import { Button } from '../components/atoms/Button.jsx';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        nik: user.nik || '',
        birthPlace: user.birthPlace || '',
        birthDate: user.birthDate || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Menyimpan pembaruan profil...');

    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        setUser(response.data);
        toast.success('Profil berhasil diperbarui.', { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto">
        <header className="mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pengaturan Profil</h2>
          <p className="text-sm text-slate-500 mt-1">Perbarui identitas dan data administratif Anda.</p>
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
            id="nik"
            label="Nomor Induk Kependudukan (NIK)"
            icon="IdCard"
            type="text"
            inputMode="numeric"
            value={formData.nik}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              id="birthPlace"
              label="Tempat Lahir"
              icon="MapPin"
              value={formData.birthPlace}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <InputField
              id="birthDate"
              label="Tanggal Lahir"
              type="date"
              icon="Calendar"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Kelamin</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none bg-white transition-all disabled:bg-slate-50"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-50">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};