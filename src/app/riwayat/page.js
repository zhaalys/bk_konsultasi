'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { exportHasilKonsultasiPDF } from '@/lib/pdfExport';

export default function RiwayatPage() {
  const router = useRouter();
  const [konsultasi, setKonsultasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasilKonsultasiMap, setHasilKonsultasiMap] = useState({});

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Check if user is teacher, redirect to dashboard
    if (parsedUser.email?.endsWith('@bk.sch.id')) {
      router.push('/dashboard-guru');
      return;
    }

    // Load konsultasi from database
    loadKonsultasi(parsedUser.user_id);
  }, [router]);

  const loadKonsultasi = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/konsultasi?user_id=${userId}&role=siswa`);
      const data = await response.json();
      
      if (data.success) {
        const konsultasiData = data.data || [];
        setKonsultasi(konsultasiData);
        
        // Load hasil konsultasi untuk setiap konsultasi yang selesai
        // Hanya untuk konsultasi milik siswa yang login
        const hasilMap = {};
        for (const konsul of konsultasiData) {
          if (konsul.status === 'selesai') {
            try {
              // Pastikan hanya memuat hasil konsultasi untuk konsultasi milik siswa ini
              const hasilRes = await fetch(`/api/hasil-konsultasi?konsultasi_id=${konsul.konsultasi_id}&user_id=${userId}&role=siswa`);
              const hasilData = await hasilRes.json();
              if (hasilData.success && hasilData.data) {
                // Double check: pastikan konsultasi ini milik siswa yang login
                hasilMap[konsul.konsultasi_id] = hasilData.data;
              }
            } catch (error) {
              console.error('Error loading hasil konsultasi:', error);
            }
          }
        }
        setHasilKonsultasiMap(hasilMap);
      } else {
        console.error('Error loading konsultasi:', data.error);
        setKonsultasi([]);
      }
    } catch (error) {
      console.error('Error loading konsultasi:', error);
      setKonsultasi([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': {
        label: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      'diterima': {
        label: 'Diterima',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      'ditolak': {
        label: 'Ditolak',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      },
      'selesai': {
        label: 'Selesai',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    };

    const config = statusConfig[status] || statusConfig['pending'];

    return (
      <span className={`inline-flex items-center space-x-2 px-4 py-2 ${config.bgColor} ${config.textColor} rounded-full text-sm font-semibold border-2 ${config.borderColor}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString || '-';
  };

  // Calculate statistics
  const stats = {
    total: konsultasi.length,
    pending: konsultasi.filter(k => k.status === 'pending').length,
    diterima: konsultasi.filter(k => k.status === 'diterima').length,
    ditolak: konsultasi.filter(k => k.status === 'ditolak').length,
    selesai: konsultasi.filter(k => k.status === 'selesai').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Riwayat Konsultasi
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Lihat dan kelola semua pengajuan konsultasi Anda dengan guru BK
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {!isLoading && konsultasi.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Total</p>
                    <p className="text-3xl md:text-4xl font-bold">{stats.total}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
                    <p className="text-3xl md:text-4xl font-bold">{stats.pending}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Diterima</p>
                    <p className="text-3xl md:text-4xl font-bold">{stats.diterima}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium mb-1">Ditolak</p>
                    <p className="text-3xl md:text-4xl font-bold">{stats.ditolak}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200 col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Selesai</p>
                    <p className="text-3xl md:text-4xl font-bold">{stats.selesai}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 font-medium">Memuat data konsultasi...</p>
              <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && konsultasi.length === 0 && (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-16 text-center border-2 border-blue-100">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Belum Ada Konsultasi
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Buat pengajuan konsultasi dengan guru BK untuk melihat riwayat di sini.
              </p>
              <Link
                href="/guru-bk"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-xl font-semibold"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Lihat Guru BK</span>
              </Link>
            </div>
          )}

          {/* Konsultasi List */}
          {!isLoading && konsultasi.length > 0 && (
            <div className="space-y-6">
              {konsultasi.map((konsul) => (
                <div
                  key={konsul.konsultasi_id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8 border-l-4 transform hover:-translate-y-1 ${
                    konsul.status === 'diterima' ? 'border-green-500 bg-gradient-to-r from-white to-green-50' :
                    konsul.status === 'ditolak' ? 'border-red-500 bg-gradient-to-r from-white to-red-50' :
                    konsul.status === 'selesai' ? 'border-blue-500 bg-gradient-to-r from-white to-blue-50' :
                    'border-yellow-500 bg-gradient-to-r from-white to-yellow-50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left Section - Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {konsul.judul}
                            </h3>
                            {getStatusBadge(konsul.status)}
                          </div>
                          <div className="flex items-center space-x-2 text-blue-600 mb-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="font-semibold">{konsul.nama_guru}</p>
                            {konsul.email_guru && (
                              <span className="text-gray-500 text-sm">({konsul.email_guru})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      {konsul.deskripsi && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {konsul.deskripsi}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Date & Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Tanggal</p>
                            <p className="text-gray-900 font-semibold">{formatDate(konsul.tanggal)}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Waktu</p>
                            <p className="text-gray-900 font-semibold">{formatTime(konsul.waktu)} WIB</p>
                          </div>
                        </div>
                      </div>

                      {/* Alasan Penolakan */}
                      {konsul.status === 'ditolak' && konsul.alasan_penolakan && (
                        <div className="mb-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-red-800 mb-1">Alasan Penolakan:</p>
                              <p className="text-sm text-red-700">{konsul.alasan_penolakan}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Catatan Guru */}
                      {konsul.status === 'diterima' && konsul.catatan_guru && (
                        <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-green-800 mb-1">Catatan Guru:</p>
                              <p className="text-sm text-green-700">{konsul.catatan_guru}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hasil Konsultasi */}
                      {konsul.status === 'selesai' && hasilKonsultasiMap[konsul.konsultasi_id] && (
                        <div className="mb-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-blue-900 flex items-center space-x-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Hasil Konsultasi</span>
                            </h4>
                            <button
                              onClick={async () => {
                                try {
                                  const { exportHasilKonsultasiPDF } = await import('@/lib/pdfExport');
                                  await exportHasilKonsultasiPDF(hasilKonsultasiMap[konsul.konsultasi_id]);
                                } catch (error) {
                                  console.error('Error exporting PDF:', error);
                                  alert('Gagal mengunduh PDF: ' + error.message);
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Export PDF</span>
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-bold text-gray-800 mb-2">Masalah yang Dihadapi:</p>
                              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                {hasilKonsultasiMap[konsul.konsultasi_id].masalah}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-gray-800 mb-2">Solusi yang Diberikan:</p>
                              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                {hasilKonsultasiMap[konsul.konsultasi_id].solusi}
                              </p>
                            </div>
                            
                            {hasilKonsultasiMap[konsul.konsultasi_id].tindak_lanjut && (
                              <div>
                                <p className="text-sm font-bold text-gray-800 mb-2">Tindak Lanjut:</p>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                  {hasilKonsultasiMap[konsul.konsultasi_id].tindak_lanjut}
                                </p>
                              </div>
                            )}
                            
                            {hasilKonsultasiMap[konsul.konsultasi_id].catatan_tambahan && (
                              <div>
                                <p className="text-sm font-bold text-gray-800 mb-2">Catatan Tambahan:</p>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                  {hasilKonsultasiMap[konsul.konsultasi_id].catatan_tambahan}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">Diajukan:</span> {new Date(konsul.created_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {konsul.updated_at && konsul.updated_at !== konsul.created_at && (
                            <p className="text-xs text-gray-500">
                              <span className="font-semibold">Diupdate:</span> {new Date(konsul.updated_at).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
