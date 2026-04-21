// src/pages/ProfilePage.jsx
import { useProfile } from '../hooks/useProfile.js';
import { DashboardLayout } from '../components/templates/DashboardLayout.jsx';
import { InputField } from '../components/molecules/InputField.jsx';
import { Button } from '../components/atoms/Button.jsx';

export const ProfilePage = () => {
  const { formData, isSubmitting, handleChange, handleSubmit } = useProfile();

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto">
        <header className="mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pengaturan Profil</h2>
          <p className="text-sm text-slate-500 mt-1">Perbarui identitas dan data administratif Anda.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField id="name" label="Nama Lengkap" icon="User" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
          <InputField id="nik" label="Nomor Induk Kependudukan (NIK)" icon="IdCard" type="text" inputMode="numeric" value={formData.nik} onChange={handleChange} disabled={isSubmitting} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField id="birthPlace" label="Tempat Lahir" icon="MapPin" value={formData.birthPlace} onChange={handleChange} disabled={isSubmitting} />
            <InputField id="birthDate" label="Tanggal Lahir" type="date" icon="Calendar" value={formData.birthDate} onChange={handleChange} disabled={isSubmitting} />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Kelamin</label>
            <select id="gender" value={formData.gender} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-kop-main/20 focus:border-kop-main outline-none bg-white transition-all disabled:bg-slate-50">
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