// src/pages/AdminUsersPage.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useUsers } from "../hooks/useUsers.js";
import { DashboardLayout } from "../components/templates/DashboardLayout.jsx";
import { UserFormModal } from "../components/molecules/UserFormModal.jsx";
import { UserDetailModal } from "../components/molecules/UserDetailModal.jsx";
import { Button } from "../components/atoms/Button.jsx";
import Icon from "../components/atoms/Icon.jsx";

export const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const isAdmin =
    currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";

  const {
    users,
    isLoading,
    isProcessing,
    handleCreateUser,
    handleToggleStatus,
  } = useUsers();

  // State Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    userId: null,
  });

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const canToggleStatus = (targetUser) => {
    if (targetUser.role === "SUPER_ADMIN") return false;
    if (targetUser.role === "ADMIN" && currentUser.role !== "SUPER_ADMIN")
      return false;
    if (targetUser.id === currentUser.id) return false;
    return true;
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Manajemen Anggota
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Kelola daftar pengguna, hak akses, dan status akun.
            </p>
          </div>
          <Button
            onClick={() => setIsFormModalOpen(true)}
            className="!w-auto flex items-center gap-2 px-5"
          >
            <Icon name="UserPlus" size={18} /> Tambah Anggota
          </Button>
        </header>

        {/* Container List: Table (Desktop) & Cards (Mobile) */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          
          {/* --- DESKTOP VIEW (Visible on md and up) --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Pengguna</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-slate-400">
                      Memuat data pengguna...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-slate-400">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-2">
                              {u.name}
                              {u.id === currentUser.id && (
                                <span className="text-[10px] bg-kop-main/10 text-kop-main px-2 py-0.5 rounded-full font-bold">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                              {u.role.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit mx-auto gap-1.5 ${
                            u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                          {u.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailModal({ isOpen: true, userId: u.id })}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Lihat Detail"
                          >
                            <Icon name="Eye" size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u.id, u.isActive)}
                            disabled={!canToggleStatus(u) || isProcessing}
                            className={`p-2 rounded-lg transition-all ${
                              !canToggleStatus(u)
                                ? "text-slate-300 cursor-not-allowed"
                                : u.isActive
                                ? "text-red-500 hover:bg-red-50"
                                : "text-green-500 hover:bg-green-50"
                            }`}
                          >
                            <Icon name={u.isActive ? "UserX" : "UserCheck"} size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE VIEW (Visible on screens smaller than md) --- */}
          <div className="md:hidden divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400">Memuat data...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-400">Tidak ada pengguna.</div>
            ) : (
              users.map((u) => (
                <div key={u.id} className="p-5 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase text-lg">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                          {u.name}
                          {u.id === currentUser.id && (
                            <span className="text-[10px] bg-kop-main/10 text-kop-main px-2 py-0.5 rounded-full">Anda</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{u.role.replace("_", " ")}</p>
                        {/* Status Kecil di bawah Nama */}
                        <div className={`mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${u.isActive ? "text-green-600" : "text-red-600"}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                           {u.isActive ? "Aktif" : "Nonaktif"}
                        </div>
                      </div>
                    </div>
                    {/* Tombol Detail dipojokkan */}
                    <button 
                      onClick={() => setDetailModal({ isOpen: true, userId: u.id })}
                      className="p-2.5 bg-slate-50 text-blue-500 rounded-xl active:scale-95 transition-transform"
                    >
                      <Icon name="Eye" size={20} />
                    </button>
                  </div>

                  {/* Tombol Aksi Full Width untuk Mobile */}
                  <button
                    onClick={() => handleToggleStatus(u.id, u.isActive)}
                    disabled={!canToggleStatus(u) || isProcessing}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      !canToggleStatus(u)
                        ? "bg-slate-50 text-slate-300 border border-slate-100"
                        : u.isActive
                          ? "bg-red-50 text-red-600 border border-red-100 active:bg-red-100"
                          : "bg-green-50 text-green-600 border border-green-100 active:bg-green-100"
                    }`}
                  >
                    <Icon name={u.isActive ? "UserX" : "UserCheck"} size={18} />
                    {u.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={(data) =>
          handleCreateUser(data, () => setIsFormModalOpen(false))
        }
        isProcessing={isProcessing}
      />

      <UserDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, userId: null })}
        userId={detailModal.userId}
      />
    </DashboardLayout>
  );
};