'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSiswa: 0,
    totalGuru: 0,
    totalKonsultasi: 0,
    konsultasiPending: 0,
  });
  
  // Data
  const [users, setUsers] = useState([]);
  const [konsultasi, setKonsultasi] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Messaging
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [sentMessages, setSentMessages] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/admin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/admin');
      return;
    }

    setUser(parsedUser);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      // Load users
      await loadUsers();
      
      // Load konsultasi
      await loadKonsultasi();
      
      // Load sent messages
      await loadSentMessages();
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadKonsultasi = async () => {
    try {
      const res = await fetch('/api/admin/konsultasi');
      if (res.ok) {
        const data = await res.json();
        setKonsultasi(data.konsultasi || []);
      }
    } catch (error) {
      console.error('Error loading konsultasi:', error);
    }
  };

  const handleKickUser = async (userId) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan user ini?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}/kick`, {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('User berhasil dinonaktifkan', 'success');
        loadUsers();
        loadData();
      } else {
        showToast(data.error || 'Gagal menonaktifkan user', 'error');
      }
    } catch (error) {
      console.error('Error kicking user:', error);
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('User berhasil diaktifkan', 'success');
        loadUsers();
        loadData();
      } else {
        showToast(data.error || 'Gagal mengaktifkan user', 'error');
      }
    } catch (error) {
      console.error('Error activating user:', error);
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('PERINGATAN: Menghapus user akan menghapus semua data terkait (konsultasi, notifikasi, dll). Apakah Anda yakin?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('User berhasil dihapus', 'success');
        loadUsers();
        loadData();
      } else {
        showToast(data.error || 'Gagal menghapus user', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const handleDeleteKonsultasi = async (konsultasiId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konsultasi ini?')) return;
    
    try {
      const res = await fetch(`/api/admin/konsultasi/${konsultasiId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('Konsultasi berhasil dihapus', 'success');
        loadKonsultasi();
        loadData();
      } else {
        showToast(data.error || 'Gagal menghapus konsultasi', 'error');
      }
    } catch (error) {
      console.error('Error deleting konsultasi:', error);
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const loadSentMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setSentMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading sent messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      showToast('Pilih user terlebih dahulu', 'error');
      return;
    }
    
    if (!messageTitle.trim() || !messageContent.trim()) {
      showToast('Judul dan isi pesan harus diisi', 'error');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUser.user_id,
          judul: messageTitle,
          pesan: messageContent,
          tipe: messageType,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('Pesan berhasil dikirim', 'success');
        setMessageTitle('');
        setMessageContent('');
        setSelectedUser(null);
        setMessageType('info');
        loadSentMessages();
      } else {
        showToast(data.error || 'Gagal mengirim pesan', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const handleSendToAll = async (e) => {
    e.preventDefault();
    
    if (!messageTitle.trim() || !messageContent.trim()) {
      showToast('Judul dan isi pesan harus diisi', 'error');
      return;
    }
    
    if (!confirm(`Apakah Anda yakin ingin mengirim pesan ini ke SEMUA ${filterRole === 'all' ? 'USER' : filterRole.toUpperCase()}?`)) {
      return;
    }
    
    try {
      const res = await fetch('/api/admin/messages/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: filterRole === 'all' ? null : filterRole,
          judul: messageTitle,
          pesan: messageContent,
          tipe: messageType,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast(`Pesan berhasil dikirim ke ${data.count} user`, 'success');
        setMessageTitle('');
        setMessageContent('');
        setMessageType('info');
        loadSentMessages();
      } else {
        showToast(data.error || 'Gagal mengirim pesan', 'error');
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      showToast('Terjadi kesalahan', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nis_nip?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const filteredKonsultasi = konsultasi.filter(k => {
    const matchesStatus = filterStatus === 'all' || k.status === filterStatus;
    return matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Selamat datang, {user?.nama_lengkap || 'Admin'}
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  router.push('/admin');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Keluar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b shadow-sm rounded-t-xl">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide p-4">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { id: 'users', label: 'Manajemen Users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { id: 'konsultasi', label: 'Manajemen Konsultasi', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { id: 'pesan', label: 'Kirim Pesan', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white rounded-xl shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-xl shadow-xl p-6 md:p-8">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistik Sistem</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                    <p className="text-blue-100 text-sm font-medium mb-2">Total Users</p>
                    <p className="text-4xl font-bold">{stats.totalUsers}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                    <p className="text-green-100 text-sm font-medium mb-2">Total Siswa</p>
                    <p className="text-4xl font-bold">{stats.totalSiswa}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                    <p className="text-purple-100 text-sm font-medium mb-2">Total Guru</p>
                    <p className="text-4xl font-bold">{stats.totalGuru}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white">
                    <p className="text-yellow-100 text-sm font-medium mb-2">Total Konsultasi</p>
                    <p className="text-4xl font-bold">{stats.totalKonsultasi}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                    <p className="text-blue-100 text-sm font-medium mb-2">Konsultasi Pending</p>
                    <p className="text-4xl font-bold">{stats.konsultasiPending}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <h2 className="text-2xl font-bold text-gray-900">Manajemen Users</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <input
                      type="text"
                      placeholder="Cari user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">Semua Role</option>
                      <option value="siswa">Siswa</option>
                      <option value="guru">Guru</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NIS/NIP</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            Tidak ada user ditemukan
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.user_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{u.nama_lengkap}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{u.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{u.nis_nip}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                u.role === 'guru' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {u.is_active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {u.is_active ? (
                                <button
                                  onClick={() => handleKickUser(u.user_id)}
                                  className="text-yellow-600 hover:text-yellow-900 font-semibold"
                                >
                                  Kick
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivateUser(u.user_id)}
                                  className="text-green-600 hover:text-green-900 font-semibold"
                                >
                                  Aktifkan
                                </button>
                              )}
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(u.user_id)}
                                  className="text-red-600 hover:text-red-900 font-semibold"
                                >
                                  Hapus
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Konsultasi Tab */}
            {activeTab === 'konsultasi' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <h2 className="text-2xl font-bold text-gray-900">Manajemen Konsultasi</h2>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="diterima">Diterima</option>
                    <option value="ditolak">Ditolak</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredKonsultasi.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Tidak ada konsultasi ditemukan
                    </div>
                  ) : (
                    filteredKonsultasi.map((k) => (
                      <div key={k.konsultasi_id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{k.judul}</h3>
                            <p className="text-sm text-gray-600 mb-2">{k.deskripsi}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span><strong>Tanggal:</strong> {new Date(k.tanggal).toLocaleDateString('id-ID')}</span>
                              <span><strong>Waktu:</strong> {k.waktu}</span>
                              <span><strong>Siswa ID:</strong> {k.siswa_id}</span>
                              <span><strong>Guru ID:</strong> {k.guru_id}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              k.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              k.status === 'diterima' ? 'bg-green-100 text-green-800' :
                              k.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {k.status}
                            </span>
                            <button
                              onClick={() => handleDeleteKonsultasi(k.konsultasi_id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Pesan Tab */}
            {activeTab === 'pesan' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form Kirim Pesan */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Kirim Pesan ke User</h3>
                      
                      <form onSubmit={handleSendMessage} className="space-y-4">
                        {/* Pilih User */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pilih User
                          </label>
                          <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl">
                            {filteredUsers.map((u) => (
                              <button
                                key={u.user_id}
                                type="button"
                                onClick={() => setSelectedUser(u)}
                                className={`w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors ${
                                  selectedUser?.user_id === u.user_id ? 'bg-blue-100 border-blue-300' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-gray-900">{u.nama_lengkap}</p>
                                    <p className="text-sm text-gray-600">{u.email}</p>
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                    u.role === 'guru' ? 'bg-purple-100 text-purple-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {u.role}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                          {selectedUser && (
                            <p className="mt-2 text-sm text-blue-600">
                              Terpilih: <strong>{selectedUser.nama_lengkap}</strong>
                            </p>
                          )}
                        </div>

                        {/* Tipe Pesan */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipe Pesan
                          </label>
                          <select
                            value={messageType}
                            onChange={(e) => setMessageType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="info">Info</option>
                            <option value="warning">Peringatan</option>
                            <option value="announcement">Pengumuman</option>
                            <option value="reminder">Pengingat</option>
                          </select>
                        </div>

                        {/* Judul */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Judul Pesan
                          </label>
                          <input
                            type="text"
                            value={messageTitle}
                            onChange={(e) => setMessageTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan judul pesan"
                          />
                        </div>

                        {/* Isi Pesan */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Isi Pesan
                          </label>
                          <textarea
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            required
                            rows={5}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Masukkan isi pesan"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                        >
                          Kirim Pesan
                        </button>
                      </form>
                    </div>

                    {/* Broadcast Form */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Broadcast Pesan</h3>
                      
                      <form onSubmit={handleSendToAll} className="space-y-4">
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Kirim ke
                          </label>
                          <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="all">Semua User</option>
                            <option value="siswa">Semua Siswa</option>
                            <option value="guru">Semua Guru</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipe Pesan
                          </label>
                          <select
                            value={messageType}
                            onChange={(e) => setMessageType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="info">Info</option>
                            <option value="warning">Peringatan</option>
                            <option value="announcement">Pengumuman</option>
                            <option value="reminder">Pengingat</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Judul Pesan
                          </label>
                          <input
                            type="text"
                            value={messageTitle}
                            onChange={(e) => setMessageTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Masukkan judul pesan"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Isi Pesan
                          </label>
                          <textarea
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            required
                            rows={5}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                            placeholder="Masukkan isi pesan"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                        >
                          Broadcast ke Semua
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Riwayat Pesan */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Riwayat Pesan Terkirim</h3>
                    <div className="space-y-4 max-h-[800px] overflow-y-auto">
                      {sentMessages.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                          Belum ada pesan yang dikirim
                        </div>
                      ) : (
                        sentMessages.map((msg) => (
                          <div key={msg.notifikasi_id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{msg.judul?.replace('Admin: ', '') || msg.judul}</h4>
                                <p className="text-sm text-gray-600 mt-1">{msg.pesan}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                msg.tipe === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                msg.tipe === 'announcement' ? 'bg-blue-100 text-blue-800' :
                                msg.tipe === 'reminder' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {msg.tipe || 'reminder'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                              <span>Ke: {msg.nama_user || 'Broadcast'}</span>
                              <span>{new Date(msg.created_at).toLocaleString('id-ID')}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

