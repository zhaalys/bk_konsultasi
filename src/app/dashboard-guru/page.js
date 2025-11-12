'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardGuru() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalSiswa: 0,
    konsultasiPending: 0,
    konsultasiHariIni: 0,
    totalKonsultasi: 0,
  });
  const [konsultasiPending, setKonsultasiPending] = useState([]);
  const [konsultasiAll, setKonsultasiAll] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [hasilKonsultasiList, setHasilKonsultasiList] = useState([]);
  const [notifikasi, setNotifikasi] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifikasi, setShowNotifikasi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showFormHasil, setShowFormHasil] = useState(false);
  const [selectedKonsultasi, setSelectedKonsultasi] = useState(null);
  const [formData, setFormData] = useState({
    nama_siswa: '',
    nis_siswa: '',
    kelas: '',
    tanggal_lahir: '',
    alamat: '',
    alamat_lengkap: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
    no_telp: '',
    tanggal_konsultasi: '',
    waktu_konsultasi: '',
    topik_konsultasi: '',
    jenis_masalah: '',
    masalah: '',
    latar_belakang: '',
    gejala: '',
    solusi: '',
    langkah_solusi: '',
    rekomendasi: '',
    tindak_lanjut: '',
    jadwal_tindak_lanjut: '',
    catatan_tambahan: '',
    nama_guru: '',
    nip_guru: '',
    email_guru: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    const isGuru = parsedUser.role === 'guru' || parsedUser.email?.endsWith('@bk.sch.id');
    
    if (!isGuru) {
      router.push('/profil-murid');
      return;
    }

    if (parsedUser.email?.endsWith('@bk.sch.id') && parsedUser.role !== 'guru') {
      parsedUser.role = 'guru';
      localStorage.setItem('user', JSON.stringify(parsedUser));
    }

    setUser(parsedUser);
    loadData(parsedUser.user_id);
    
    // Polling notifikasi setiap 10 detik
    const interval = setInterval(() => {
      loadNotifikasi(parsedUser.user_id);
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const loadData = async (guruId) => {
    try {
      setLoading(true);
      
      console.log('Loading data for guru_id:', guruId);
      
      // Load stats
      try {
        const statsRes = await fetch(`/api/konsultasi?user_id=${guruId}&role=guru`);
        
        if (!statsRes.ok) {
          throw new Error(`HTTP error! status: ${statsRes.status}`);
        }
        
        const statsData = await statsRes.json();
        
        console.log('Konsultasi API response:', statsData);
        
        if (statsData.success) {
          const allKonsultasi = statsData.data || [];
          console.log('All konsultasi:', allKonsultasi);
          
          const pending = allKonsultasi.filter(k => k.status === 'pending');
          const today = new Date().toISOString().split('T')[0];
          const todayKonsultasi = allKonsultasi.filter(k => k.tanggal === today);
          
          setStats({
            totalSiswa: new Set(allKonsultasi.map(k => k.siswa_id)).size,
            konsultasiPending: pending.length,
            konsultasiHariIni: todayKonsultasi.length,
            totalKonsultasi: allKonsultasi.length,
          });
          
          setKonsultasiPending(pending);
          setKonsultasiAll(allKonsultasi);
        } else {
          console.error('Konsultasi API error:', statsData.error, statsData.details);
          // Set default values jika error
          setStats({
            totalSiswa: 0,
            konsultasiPending: 0,
            konsultasiHariIni: 0,
            totalKonsultasi: 0,
          });
          setKonsultasiPending([]);
          setKonsultasiAll([]);
        }
      } catch (error) {
        console.error('Error loading konsultasi:', error);
        // Set default values jika error
        setStats({
          totalSiswa: 0,
          konsultasiPending: 0,
          konsultasiHariIni: 0,
          totalKonsultasi: 0,
        });
        setKonsultasiPending([]);
        setKonsultasiAll([]);
      }

      // Load siswa list
      const siswaRes = await fetch(`/api/users?role=siswa`);
      if (siswaRes.ok) {
        const siswaData = await siswaRes.json();
        if (siswaData.success) {
          setSiswaList(siswaData.data);
        }
      }

      // Load hasil konsultasi list untuk ditampilkan di tab
      await loadHasilKonsultasi(guruId);

      // Load notifikasi
      await loadNotifikasi(guruId);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifikasi = async (userId) => {
    try {
      console.log('Loading notifikasi for user_id:', userId);
      const res = await fetch(`/api/notifikasi?user_id=${userId}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      console.log('Notifikasi API response:', data);
      
      if (data.success) {
        setNotifikasi(data.data || []);
        setUnreadCount(data.unread_count || 0);
        console.log('Notifikasi loaded:', data.data?.length || 0, 'items');
      } else {
        console.error('Notifikasi API error:', data.error, data.details);
        // Set default values jika error
        setNotifikasi([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Load notifikasi error:', error);
      // Set default values jika error
      setNotifikasi([]);
      setUnreadCount(0);
    }
  };

  const loadHasilKonsultasi = async (guruId) => {
    try {
      const res = await fetch(`/api/hasil-konsultasi?user_id=${guruId}&role=guru`);
      const data = await res.json();
      
      if (data.success) {
        setHasilKonsultasiList(data.data || []);
      } else {
        console.error('Error loading hasil konsultasi:', data.error);
        setHasilKonsultasiList([]);
      }
    } catch (error) {
      console.error('Error loading hasil konsultasi:', error);
      setHasilKonsultasiList([]);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleTerimaTolak = async (konsultasiId, action, alasan = '') => {
    if (!user) return;
    
    if (action === 'tolak' && !alasan.trim()) {
      const inputAlasan = prompt('Masukkan alasan penolakan:');
      if (!inputAlasan || !inputAlasan.trim()) {
        showToast('Alasan penolakan harus diisi', 'error');
        return;
      }
      alasan = inputAlasan;
    }

    try {
      const res = await fetch(`/api/konsultasi/${konsultasiId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          guru_id: user.user_id,
          alasan_penolakan: action === 'tolak' ? alasan : null,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        showToast(
          action === 'terima' 
            ? 'Konsultasi berhasil diterima! Notifikasi telah dikirim ke siswa.' 
            : 'Konsultasi telah ditolak. Notifikasi telah dikirim ke siswa.',
          action === 'terima' ? 'success' : 'warning'
        );
        loadData(user.user_id);
        loadNotifikasi(user.user_id);
      } else {
        showToast(data.error || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      console.error('Terima/tolak error:', error);
      showToast('Terjadi kesalahan saat memproses', 'error');
    }
  };

  const markNotifikasiRead = async (notifikasiId = null) => {
    if (!user) return;
    
    try {
      await fetch('/api/notifikasi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          notifikasi_id: notifikasiId,
          mark_all: !notifikasiId,
        }),
      });
      
      loadNotifikasi(user.user_id);
    } catch (error) {
      console.error('Mark notifikasi error:', error);
    }
  };

  const handleBukaFormHasil = async (konsul) => {
    setSelectedKonsultasi(konsul);
    
    // Cek apakah sudah ada hasil konsultasi
    try {
      const res = await fetch(`/api/hasil-konsultasi?konsultasi_id=${konsul.konsultasi_id}`);
      const data = await res.json();
      
      if (data.success && data.data) {
        // Load existing data
        setFormData({
          nama_siswa: data.data.nama_siswa || konsul.nama_siswa || '',
          nis_siswa: data.data.nis_siswa || konsul.nis_siswa || '',
          kelas: data.data.kelas || '',
          tanggal_konsultasi: data.data.tanggal_konsultasi || konsul.tanggal || '',
          waktu_konsultasi: data.data.waktu_konsultasi || konsul.waktu || '',
          masalah: data.data.masalah || '',
          solusi: data.data.solusi || '',
          tindak_lanjut: data.data.tindak_lanjut || '',
          catatan_tambahan: data.data.catatan_tambahan || '',
          nama_guru: data.data.nama_guru || user?.nama_lengkap || '',
          nip_guru: data.data.nip_guru || user?.nis_nip || '',
        });
      } else {
        // Set default values
        setFormData({
          nama_siswa: konsul.nama_siswa || '',
          nis_siswa: konsul.nis_siswa || '',
          kelas: '',
          tanggal_lahir: '',
          alamat: '',
          alamat_lengkap: '',
          kota: '',
          provinsi: '',
          kode_pos: '',
          no_telp: '',
          tanggal_konsultasi: konsul.tanggal || '',
          waktu_konsultasi: konsul.waktu || '',
          topik_konsultasi: konsul.judul || '',
          jenis_masalah: '',
          masalah: '',
          latar_belakang: '',
          gejala: '',
          solusi: '',
          langkah_solusi: '',
          rekomendasi: '',
          tindak_lanjut: '',
          jadwal_tindak_lanjut: '',
          catatan_tambahan: '',
          nama_guru: user?.nama_lengkap || '',
          nip_guru: user?.nis_nip || '',
          email_guru: user?.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading hasil konsultasi:', error);
      // Set default values
      setFormData({
        nama_siswa: konsul.nama_siswa || '',
        nis_siswa: konsul.nis_siswa || '',
        kelas: '',
        tanggal_konsultasi: konsul.tanggal || '',
        waktu_konsultasi: konsul.waktu || '',
        masalah: '',
        solusi: '',
        tindak_lanjut: '',
        catatan_tambahan: '',
        nama_guru: user?.nama_lengkap || '',
        nip_guru: user?.nis_nip || '',
      });
    }
    
    setShowFormHasil(true);
  };

  const handleSimpanHasil = async (e) => {
    e.preventDefault();
    if (!selectedKonsultasi) {
      showToast('Konsultasi tidak dipilih', 'error');
      return;
    }

    // Validasi field required
    if (!formData.nama_siswa || !formData.nis_siswa || !formData.tanggal_konsultasi || !formData.waktu_konsultasi || !formData.masalah || !formData.solusi || !formData.nama_guru) {
      showToast('Mohon lengkapi semua field wajib (Nama Siswa, NIS, Tanggal, Waktu, Masalah, Solusi, Nama Guru)', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Mengirim data ke API:', {
        konsultasi_id: selectedKonsultasi.konsultasi_id,
        ...formData
      });

      const res = await fetch('/api/hasil-konsultasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          konsultasi_id: selectedKonsultasi.konsultasi_id,
          ...formData,
        }),
      });

      const data = await res.json();
      
      console.log('Response dari API:', data);
      
      if (data.success) {
        showToast('Hasil konsultasi berhasil disimpan!', 'success');
        
        // Auto download PDF setelah simpan
        try {
          // Tunggu sebentar untuk memastikan data sudah tersimpan di database
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const resPDF = await fetch(`/api/hasil-konsultasi?konsultasi_id=${selectedKonsultasi.konsultasi_id}`);
          
          if (!resPDF.ok) {
            throw new Error(`HTTP error! status: ${resPDF.status}`);
          }
          
          const dataPDF = await resPDF.json();
          
          console.log('PDF Response:', dataPDF);
          
          // Import fungsi PDF
          const { exportHasilKonsultasiPDF } = await import('@/lib/pdfExport');
          
          let pdfData = null;
          
          if (dataPDF.success && dataPDF.data) {
            // Gunakan data dari database
            pdfData = {
              ...dataPDF.data,
              judul: dataPDF.data.topik_konsultasi || dataPDF.data.judul || formData.topik_konsultasi || selectedKonsultasi.judul,
            };
            console.log('PDF Data dari database:', pdfData);
          } else {
            // Fallback: gunakan formData langsung
            pdfData = {
              ...formData,
              judul: formData.topik_konsultasi || selectedKonsultasi.judul,
            };
            console.log('PDF Data dari formData:', pdfData);
          }
          
          // Pastikan data minimal ada
          if (!pdfData.nama_siswa) {
            pdfData.nama_siswa = formData.nama_siswa || selectedKonsultasi.nama_siswa || 'Siswa';
          }
          if (!pdfData.masalah) {
            pdfData.masalah = formData.masalah || '-';
          }
          if (!pdfData.solusi) {
            pdfData.solusi = formData.solusi || '-';
          }
          
          // Panggil fungsi export
          console.log('Memanggil exportHasilKonsultasiPDF dengan data:', pdfData);
          await exportHasilKonsultasiPDF(pdfData);
          
          // Tunggu sebentar sebelum show toast
          setTimeout(() => {
            showToast('PDF berhasil diunduh!', 'success');
          }, 500);
          
        } catch (error) {
          console.error('Error auto-download PDF:', error);
          
          // Fallback: coba download dengan formData langsung
          try {
            console.log('Mencoba fallback dengan formData:', formData);
            const { exportHasilKonsultasiPDF } = await import('@/lib/pdfExport');
            
            const pdfData = {
              ...formData,
              judul: formData.topik_konsultasi || selectedKonsultasi.judul,
              nama_siswa: formData.nama_siswa || selectedKonsultasi.nama_siswa || 'Siswa',
              masalah: formData.masalah || '-',
              solusi: formData.solusi || '-',
            };
            
            console.log('Fallback PDF Data:', pdfData);
            await exportHasilKonsultasiPDF(pdfData);
            
            setTimeout(() => {
              showToast('PDF berhasil diunduh!', 'success');
            }, 500);
          } catch (fallbackError) {
            console.error('Fallback PDF error:', fallbackError);
            showToast(`Gagal mengunduh PDF: ${fallbackError.message}`, 'error');
          }
        }
        
        setShowFormHasil(false);
        await loadData(user.user_id);
        // Reload hasil konsultasi list
        await loadHasilKonsultasi(user.user_id);
      } else {
        const errorMsg = data.error || 'Gagal menyimpan hasil konsultasi';
        const errorDetails = data.details || data.sqlError || '';
        const fullErrorMsg = errorDetails ? `${errorMsg}: ${errorDetails}` : errorMsg;
        console.error('API Error:', errorMsg, data);
        console.error('Error details:', data.details, data.sqlError, data.missing_fields);
        showToast(fullErrorMsg, 'error');
      }
    } catch (error) {
      console.error('Error saving hasil konsultasi:', error);
      showToast(`Terjadi kesalahan saat menyimpan: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = async (konsultasiId) => {
    try {
      console.log('handleExportPDF dipanggil dengan konsultasiId:', konsultasiId);
      
      const res = await fetch(`/api/hasil-konsultasi?konsultasi_id=${konsultasiId}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Response dari API:', data);
      
      if (data.success && data.data) {
        console.log('Data hasil konsultasi ditemukan:', data.data);
        const { exportHasilKonsultasiPDF } = await import('@/lib/pdfExport');
        
        // Pastikan data lengkap
        const pdfData = {
          ...data.data,
          judul: data.data.topik_konsultasi || data.data.judul || '-',
          nama_siswa: data.data.nama_siswa || '-',
          masalah: data.data.masalah || '-',
          solusi: data.data.solusi || '-',
        };
        
        console.log('Memanggil exportHasilKonsultasiPDF dengan data:', pdfData);
        await exportHasilKonsultasiPDF(pdfData);
        
        setTimeout(() => {
          showToast('PDF berhasil diunduh!', 'success');
        }, 500);
      } else {
        console.error('Data hasil konsultasi tidak ditemukan:', data);
        showToast('Data hasil konsultasi tidak ditemukan', 'error');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showToast(`Gagal mengunduh PDF: ${error.message}`, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-slideInRight">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-2xl min-w-[320px] max-w-md ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
              : toast.type === 'error'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : toast.type === 'error' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <p className="font-semibold text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 ml-4 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Guru BK</h1>
                <p className="text-blue-100">Selamat datang, {user.nama_lengkap}</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notifikasi Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifikasi(!showNotifikasi);
                      if (!showNotifikasi && unreadCount > 0) {
                        markNotifikasiRead();
                      }
                    }}
                    className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Dropdown Notifikasi */}
                  {showNotifikasi && (
                    <>
                      {/* Overlay untuk close saat klik di luar */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifikasi(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-[450px] bg-white rounded-xl shadow-2xl z-50 max-h-[650px] overflow-y-auto border-2 border-gray-200">
                        <div className="p-5 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <h3 className="font-bold text-lg text-gray-900">Notifikasi</h3>
                            {unreadCount > 0 && (
                              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={() => markNotifikasiRead()}
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-1 hover:bg-blue-200 rounded transition-colors"
                              >
                                Tandai semua
                              </button>
                            )}
                            <button
                              onClick={() => setShowNotifikasi(false)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Tutup"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      <div className="divide-y divide-gray-100">
                        {notifikasi.length === 0 ? (
                          <div className="p-12 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-gray-500 text-base font-medium">Tidak ada notifikasi</p>
                          </div>
                        ) : (
                          notifikasi.map((notif) => {
                            const isKonsultasiBaru = notif.tipe === 'konsultasi_baru';
                            
                            return (
                              <div
                                key={notif.notifikasi_id}
                                className={`p-5 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                                  !notif.is_read 
                                    ? isKonsultasiBaru
                                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                                      : 'bg-yellow-50 border-l-4 border-yellow-500'
                                    : 'bg-white'
                                }`}
                                onClick={(e) => {
                                  // Jangan tutup jika klik tombol
                                  if (e.target.tagName === 'BUTTON') return;
                                  if (!notif.is_read) {
                                    markNotifikasiRead(notif.notifikasi_id);
                                  }
                                }}
                              >
                                <div className="flex items-start space-x-4">
                                  {/* Icon berdasarkan tipe */}
                                  <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
                                    isKonsultasiBaru 
                                      ? 'bg-blue-100' 
                                      : 'bg-yellow-100'
                                  }`}>
                                    {isKonsultasiBaru ? (
                                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    ) : (
                                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <p className={`text-base font-bold ${
                                        isKonsultasiBaru 
                                          ? 'text-blue-700' 
                                          : 'text-gray-900'
                                      }`}>
                                        {notif.judul}
                                      </p>
                                      {!notif.is_read && (
                                        <span className="flex-shrink-0 ml-3 w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-lg"></span>
                                      )}
                                    </div>
                                    
                                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                      {notif.pesan}
                                    </p>
                                    
                                    {/* Info Konsultasi jika ada */}
                                    {notif.konsultasi_id && isKonsultasiBaru && (
                                      <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl shadow-lg">
                                        <div className="flex items-center space-x-3 mb-4">
                                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                          <p className="text-sm font-bold text-blue-900">Detail Konsultasi</p>
                                        </div>
                                        
                                        <div className="space-y-3">
                                          {notif.nama_siswa && (
                                            <div className="flex items-start space-x-3">
                                              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                              </svg>
                                              <p className="text-sm text-gray-800">
                                                <span className="font-bold">Siswa:</span> {notif.nama_siswa} {notif.nis_siswa && <span className="text-gray-600">(NIS: {notif.nis_siswa})</span>}
                                              </p>
                                            </div>
                                          )}
                                          
                                          {notif.konsultasi_judul && (
                                            <div className="flex items-start space-x-3">
                                              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-7 4h7" />
                                              </svg>
                                              <p className="text-sm text-gray-800">
                                                <span className="font-bold">Topik:</span> {notif.konsultasi_judul}
                                              </p>
                                            </div>
                                          )}
                                          
                                          {notif.konsultasi_tanggal && notif.konsultasi_waktu && (
                                            <div className="flex items-start space-x-3">
                                              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                              </svg>
                                              <p className="text-sm text-gray-800">
                                                <span className="font-bold">Jadwal:</span> {new Date(notif.konsultasi_tanggal).toLocaleDateString('id-ID', { 
                                                  weekday: 'long', 
                                                  year: 'numeric', 
                                                  month: 'long', 
                                                  day: 'numeric' 
                                                })} pukul {notif.konsultasi_waktu}
                                              </p>
                                            </div>
                                          )}
                                          
                                          {notif.konsultasi_deskripsi && (
                                            <div className="mt-4 pt-4 border-t-2 border-blue-200">
                                              <div className="flex items-start space-x-3">
                                                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                                </svg>
                                                <p className="text-sm text-gray-800 leading-relaxed">
                                                  <span className="font-bold">Deskripsi:</span> {notif.konsultasi_deskripsi}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Tombol Terima/Tolak */}
                                        {notif.konsultasi_status === 'pending' && (
                                          <div className="flex space-x-3 mt-5 pt-4 border-t-2 border-blue-200">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTerimaTolak(notif.konsultasi_id, 'terima');
                                                setShowNotifikasi(false);
                                              }}
                                              className="flex-1 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                            >
                                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                              <span>Terima</span>
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTerimaTolak(notif.konsultasi_id, 'tolak');
                                                setShowNotifikasi(false);
                                              }}
                                              className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-bold hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                            >
                                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                              </svg>
                                              <span>Tolak</span>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    <p className="text-sm text-gray-400 mt-3 font-medium">
                                      {new Date(notif.created_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                    </>
                  )}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { id: 'konsultasi', label: 'Konsultasi Pending', count: stats.konsultasiPending, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'semua-konsultasi', label: 'Semua Konsultasi', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { id: 'form-hasil', label: 'Form Hasil Konsultasi', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { id: 'siswa', label: 'Daftar Siswa', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-6 py-3 font-medium text-sm transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-3 border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-2xl p-8 md:p-10 mb-8 text-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center space-x-3">
                          <span>Selamat Datang, {user?.nama_lengkap || 'Guru BK'}!</span>
                          <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </h2>
                        <p className="text-blue-100 text-lg md:text-xl">
                          Kelola konsultasi siswa dan pantau aktivitas bimbingan konseling
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:ml-6">
                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xl transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Hari Ini</p>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">{new Date().toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} WIB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl shadow-2xl p-6 md:p-7 text-white transform hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer relative overflow-hidden group" onClick={() => setActiveTab('siswa')}>
                  {/* Decorative circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white bg-opacity-25 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30 group-hover:bg-opacity-30 transition-all">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm font-semibold mb-2 uppercase tracking-wide">Total Siswa</p>
                      <p className="text-4xl md:text-5xl font-bold mb-2">{stats.totalSiswa}</p>
                      <p className="text-xs text-blue-100 opacity-90 flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span>Klik untuk lihat daftar</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-3xl shadow-2xl p-6 md:p-7 text-white transform hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer relative overflow-hidden group" onClick={() => setActiveTab('konsultasi')}>
                  {/* Decorative circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white bg-opacity-25 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30 group-hover:bg-opacity-30 transition-all">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-yellow-100 text-sm font-semibold mb-2 uppercase tracking-wide">Konsultasi Pending</p>
                      <p className="text-4xl md:text-5xl font-bold mb-2">{stats.konsultasiPending}</p>
                      <p className="text-xs text-yellow-100 opacity-90">Perlu ditinjau segera</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl shadow-2xl p-6 md:p-7 text-white transform hover:scale-105 hover:shadow-3xl transition-all duration-300 relative overflow-hidden group">
                  {/* Decorative circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white bg-opacity-25 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30 group-hover:bg-opacity-30 transition-all">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-green-100 text-sm font-semibold mb-2 uppercase tracking-wide">Konsultasi Hari Ini</p>
                      <p className="text-4xl md:text-5xl font-bold mb-2">{stats.konsultasiHariIni}</p>
                      <p className="text-xs text-green-100 opacity-90">Jadwal hari ini</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl shadow-2xl p-6 md:p-7 text-white transform hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer relative overflow-hidden group" onClick={() => setActiveTab('semua-konsultasi')}>
                  {/* Decorative circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white bg-opacity-25 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30 group-hover:bg-opacity-30 transition-all">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-purple-100 text-sm font-semibold mb-2 uppercase tracking-wide">Total Konsultasi</p>
                      <p className="text-4xl md:text-5xl font-bold mb-2">{stats.totalKonsultasi}</p>
                      <p className="text-xs text-purple-100 opacity-90 flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span>Klik untuk lihat semua</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Pending Konsultasi */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span>Konsultasi Pending Terbaru</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('konsultasi')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <span>Lihat Semua</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {konsultasiPending.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">Tidak ada konsultasi pending</p>
                      <p className="text-gray-400 text-sm mt-1">Semua konsultasi sudah ditinjau</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {konsultasiPending.slice(0, 3).map((konsul) => (
                        <div key={konsul.konsultasi_id} className="border-2 border-yellow-200 rounded-xl p-5 hover:bg-yellow-50 transition-all duration-200 hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base mb-2">{konsul.judul}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span>{konsul.nama_siswa}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{new Date(konsul.tanggal).toLocaleDateString('id-ID')} {konsul.waktu}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <button
                                onClick={() => handleTerimaTolak(konsul.konsultasi_id, 'terima')}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                              >
                                Terima
                              </button>
                              <button
                                onClick={() => handleTerimaTolak(konsul.konsultasi_id, 'tolak')}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                              >
                                Tolak
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Hasil Konsultasi */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span>Hasil Konsultasi Terbaru</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('form-hasil')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <span>Lihat Semua</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {hasilKonsultasiList.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">Belum ada hasil konsultasi</p>
                      <p className="text-gray-400 text-sm mt-1">Hasil akan muncul setelah form diisi</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hasilKonsultasiList.slice(0, 3).map((hasil) => (
                        <div key={hasil.hasil_id || hasil.konsultasi_id} className="border-2 border-green-200 rounded-xl p-5 hover:bg-green-50 transition-all duration-200 hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base mb-2">
                                {hasil.nama_siswa || hasil.nama_siswa_full || 'Siswa'}
                              </h4>
                              <p className="text-sm text-gray-700 mb-2 font-medium">
                                {hasil.topik_konsultasi || hasil.judul || 'Konsultasi'}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{hasil.created_at && new Date(hasil.created_at).toLocaleDateString('id-ID')}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleExportPDF(hasil.konsultasi_id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>PDF</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Konsultasi Pending Tab */}
          {activeTab === 'konsultasi' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Konsultasi Pending</h2>
                  <p className="text-sm text-gray-600 mt-1">Tinjau dan terima/tolak pengajuan konsultasi</p>
                </div>
              </div>
              {konsultasiPending.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">Tidak ada konsultasi pending</p>
                  <p className="text-sm text-gray-500 mt-2">Semua konsultasi sudah ditinjau</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {konsultasiPending.map((konsul) => (
                    <div key={konsul.konsultasi_id} className="border-2 border-yellow-200 rounded-2xl p-6 hover:bg-yellow-50 transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-white to-yellow-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{konsul.judul}</h3>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{konsul.deskripsi}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {konsul.nama_siswa} ({konsul.nis_siswa})
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(konsul.tanggal).toLocaleDateString('id-ID')} {konsul.waktu}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 ml-4">
                          <button
                            onClick={() => handleTerimaTolak(konsul.konsultasi_id, 'terima')}
                            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Terima</span>
                          </button>
                          <button
                            onClick={() => handleTerimaTolak(konsul.konsultasi_id, 'tolak')}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Tolak</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Semua Konsultasi Tab */}
          {activeTab === 'semua-konsultasi' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Semua Konsultasi</h2>
                  <p className="text-sm text-gray-600 mt-1">Lihat semua konsultasi dengan berbagai status</p>
                </div>
              </div>
              {konsultasiAll.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">Tidak ada konsultasi</p>
                  <p className="text-sm text-gray-500 mt-2">Belum ada pengajuan konsultasi</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {konsultasiAll.map((konsul) => (
                    <div key={konsul.konsultasi_id} className={`border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 ${
                      konsul.status === 'diterima' ? 'border-green-300 bg-gradient-to-r from-white to-green-50' :
                      konsul.status === 'ditolak' ? 'border-red-300 bg-gradient-to-r from-white to-red-50' :
                      konsul.status === 'selesai' ? 'border-blue-300 bg-gradient-to-r from-white to-blue-50' :
                      'border-yellow-300 bg-gradient-to-r from-white to-yellow-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{konsul.judul}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              konsul.status === 'diterima' ? 'bg-green-100 text-green-800' :
                              konsul.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                              konsul.status === 'selesai' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {konsul.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{konsul.deskripsi}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{konsul.nama_siswa} ({konsul.nis_siswa})</span>
                            <span>{new Date(konsul.tanggal).toLocaleDateString('id-ID')} {konsul.waktu}</span>
                          </div>
                          {konsul.alasan_penolakan && (
                            <p className="text-sm text-red-600 mt-2">Alasan: {konsul.alasan_penolakan}</p>
                          )}
                          {konsul.catatan_guru && (
                            <p className="text-sm text-blue-600 mt-2">Catatan: {konsul.catatan_guru}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {konsul.status === 'diterima' && (
                            <button
                              onClick={() => handleBukaFormHasil(konsul)}
                              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Isi Hasil</span>
                            </button>
                          )}
                          {konsul.status === 'selesai' && (
                            <button
                              onClick={() => handleExportPDF(konsul.konsultasi_id)}
                              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Export PDF</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form Hasil Konsultasi Tab */}
          {activeTab === 'form-hasil' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Hasil Konsultasi yang Sudah Selesai</h2>
                    <p className="text-sm text-gray-600 mt-1">Lihat dan kelola semua hasil konsultasi</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl border border-green-300">
                  <p className="text-sm font-semibold text-green-800">
                    Total: <span className="text-lg">{hasilKonsultasiList.length}</span> hasil konsultasi
                  </p>
                </div>
              </div>
              {hasilKonsultasiList.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum ada hasil konsultasi</h3>
                  <p className="text-gray-600 text-lg mb-1">Hasil konsultasi akan muncul di sini</p>
                  <p className="text-gray-500 text-sm">setelah form diisi dan disimpan</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {hasilKonsultasiList.map((hasil) => (
                    <div key={hasil.hasil_id || hasil.konsultasi_id} className="border-2 border-green-200 rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-green-50 to-white transform hover:-translate-y-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{hasil.nama_siswa || hasil.nama_siswa_full || 'Siswa'}</h3>
                              <p className="text-sm text-gray-600">NIS: {hasil.nis_siswa || '-'}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Selesai
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Topik Konsultasi</p>
                              <p className="text-sm text-gray-900">{hasil.topik_konsultasi || hasil.judul || '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Tanggal Konsultasi</p>
                              <p className="text-sm text-gray-900">
                                {hasil.tanggal_konsultasi 
                                  ? new Date(hasil.tanggal_konsultasi).toLocaleDateString('id-ID', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : '-'}
                                {hasil.waktu_konsultasi && ` pukul ${hasil.waktu_konsultasi}`}
                              </p>
                            </div>
                            {hasil.kelas && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Kelas</p>
                                <p className="text-sm text-gray-900">{hasil.kelas}</p>
                              </div>
                            )}
                            {hasil.jenis_masalah && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Jenis Masalah</p>
                                <p className="text-sm text-gray-900">{hasil.jenis_masalah}</p>
                              </div>
                            )}
                          </div>

                          {hasil.masalah && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                              <p className="text-sm font-semibold text-red-900 mb-2">Masalah yang Dihadapi</p>
                              <p className="text-sm text-gray-800 line-clamp-2">{hasil.masalah}</p>
                            </div>
                          )}

                          {hasil.solusi && (
                            <div className="mt-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <p className="text-sm font-semibold text-green-900 mb-2">Solusi yang Diberikan</p>
                              <p className="text-sm text-gray-800 line-clamp-2">{hasil.solusi}</p>
                            </div>
                          )}

                          {hasil.created_at && (
                            <p className="text-xs text-gray-500 mt-4">
                              Dibuat: {new Date(hasil.created_at).toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-3 ml-4">
                          <button
                            onClick={() => handleExportPDF(hasil.konsultasi_id)}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm flex items-center justify-center space-x-2"
                            title="Download PDF"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Download PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              // Buka form untuk edit/view
                              const konsul = konsultasiAll.find(k => k.konsultasi_id === hasil.konsultasi_id);
                              if (konsul) {
                                handleBukaFormHasil(konsul);
                              }
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm flex items-center justify-center space-x-2"
                            title="Lihat/Edit Detail"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Lihat Detail</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Daftar Siswa Tab */}
          {activeTab === 'siswa' && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Daftar Siswa</h2>
                  <p className="text-sm text-gray-600 mt-1">Lihat semua siswa yang terdaftar</p>
                </div>
              </div>
              {siswaList.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">Tidak ada data siswa</p>
                  <p className="text-sm text-gray-500 mt-2">Belum ada siswa yang terdaftar</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">NIS</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {siswaList.map((siswa) => (
                        <tr key={siswa.user_id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{siswa.nis_nip}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{siswa.nama_lengkap}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{siswa.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                              siswa.is_active ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                            }`}>
                              {siswa.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Hasil Konsultasi */}
      {showFormHasil && selectedKonsultasi && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-90 z-50 flex items-start justify-center p-0 overflow-y-auto">
          <div className="bg-white shadow-2xl w-full max-w-7xl min-h-screen">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg z-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Formulir Hasil Konsultasi</span>
              </h2>
              <button
                onClick={() => setShowFormHasil(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                title="Tutup"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSimpanHasil} className="p-8 space-y-6 bg-gray-50">
                  {/* Informasi Siswa */}
                  <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Informasi Siswa</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Siswa *</label>
                        <input
                          type="text"
                          value={formData.nama_siswa}
                          onChange={(e) => setFormData({...formData, nama_siswa: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">NIS *</label>
                        <input
                          type="text"
                          value={formData.nis_siswa}
                          onChange={(e) => setFormData({...formData, nis_siswa: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kelas *</label>
                        <input
                          type="text"
                          value={formData.kelas}
                          onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: X IPA 1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Lahir</label>
                        <input
                          type="date"
                          value={formData.tanggal_lahir}
                          onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informasi Konsultasi */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-900 mb-5 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>Informasi Konsultasi</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Topik Konsultasi *</label>
                        <input
                          type="text"
                          value={formData.topik_konsultasi}
                          onChange={(e) => setFormData({...formData, topik_konsultasi: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Topik atau judul konsultasi"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Masalah</label>
                        <select
                          value={formData.jenis_masalah}
                          onChange={(e) => setFormData({...formData, jenis_masalah: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        >
                          <option value="">Pilih Jenis Masalah</option>
                          <option value="akademik">Akademik</option>
                          <option value="sosial">Sosial</option>
                          <option value="emosional">Emosional</option>
                          <option value="keluarga">Keluarga</option>
                          <option value="karir">Karir</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Konsultasi *</label>
                        <input
                          type="date"
                          value={formData.tanggal_konsultasi}
                          onChange={(e) => setFormData({...formData, tanggal_konsultasi: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Waktu Konsultasi *</label>
                        <input
                          type="time"
                          value={formData.waktu_konsultasi}
                          onChange={(e) => setFormData({...formData, waktu_konsultasi: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Masalah yang Dihadapi */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-red-900 mb-5 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <span>Masalah yang Dihadapi</span>
                    </h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Masalah *</label>
                      <textarea
                        value={formData.masalah}
                        onChange={(e) => setFormData({...formData, masalah: e.target.value})}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-y"
                        placeholder="Jelaskan secara detail masalah yang dihadapi siswa..."
                        required
                      />
                    </div>
                  </div>

                  {/* Solusi yang Diberikan */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-yellow-900 mb-5 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span>Solusi yang Diberikan</span>
                    </h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Solusi yang Diberikan *</label>
                      <textarea
                        value={formData.solusi}
                        onChange={(e) => setFormData({...formData, solusi: e.target.value})}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all resize-y"
                        placeholder="Jelaskan solusi yang diberikan kepada siswa..."
                        required
                      />
                    </div>
                  </div>

                  {/* Tindak Lanjut */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <h3 className="text-xl font-bold text-purple-900 mb-5 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <span>Tindak Lanjut</span>
                    </h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tindak Lanjut</label>
                      <textarea
                        value={formData.tindak_lanjut}
                        onChange={(e) => setFormData({...formData, tindak_lanjut: e.target.value})}
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-y"
                        placeholder="Jelaskan tindak lanjut yang akan dilakukan..."
                      />
                    </div>
                  </div>

                  {/* Catatan Tambahan */}
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-indigo-900 mb-5 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <span>Catatan Tambahan</span>
                    </h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Tambahan</label>
                      <textarea
                        value={formData.catatan_tambahan}
                        onChange={(e) => setFormData({...formData, catatan_tambahan: e.target.value})}
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
                        placeholder="Catatan tambahan, observasi, atau informasi penting lainnya..."
                      />
                    </div>
                  </div>

              {/* Informasi Guru */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gray-500">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Informasi Guru BK</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Guru BK *</label>
                    <input
                      type="text"
                      value={formData.nama_guru}
                      onChange={(e) => setFormData({...formData, nama_guru: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">NIP Guru</label>
                    <input
                      type="text"
                      value={formData.nip_guru}
                      onChange={(e) => setFormData({...formData, nip_guru: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Guru</label>
                    <input
                      type="email"
                      value={formData.email_guru}
                      onChange={(e) => setFormData({...formData, email_guru: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                      placeholder="email@guru.sch.id"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-6 border-t-2 border-gray-300 bg-white p-6 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setShowFormHasil(false)}
                  className="flex-1 px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Simpan & Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
