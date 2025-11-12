'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [notifikasi, setNotifikasi] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifikasi, setShowNotifikasi] = useState(false);
  const [userId, setUserId] = useState(null);

  const loadNotifikasi = async (userId) => {
    try {
      const res = await fetch(`/api/notifikasi?user_id=${userId}`);
      const data = await res.json();
      
      if (data.success) {
        setNotifikasi(data.data || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Load notifikasi error:', error);
    }
  };

  const markNotifikasiRead = async (notifikasiId = null) => {
    if (!userId) return;
    
    try {
      const res = await fetch('/api/notifikasi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          notifikasi_id: notifikasiId,
          mark_all: !notifikasiId,
        }),
      });
      
      if (res.ok) {
        loadNotifikasi(userId);
      }
    } catch (error) {
      console.error('Mark notifikasi error:', error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        // Pastikan email @bk.sch.id selalu dianggap sebagai guru
        const role = parsedUser.email?.endsWith('@bk.sch.id') ? 'guru' : parsedUser.role;
        setUserRole(role);
        setUserId(parsedUser.user_id);
        
        // Load notifikasi untuk siswa
        if (role === 'siswa' && parsedUser.user_id) {
          loadNotifikasi(parsedUser.user_id);
        }
      } catch (e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Polling notifikasi untuk siswa
  useEffect(() => {
    if (userRole === 'siswa' && userId) {
      loadNotifikasi(userId);
      const interval = setInterval(() => {
        loadNotifikasi(userId);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [userRole, userId]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/guru-bk', label: 'Guru BK' },
    { href: '/profil-sekolah', label: 'Profil Sekolah' },
    { href: '/peta', label: 'Peta' },
    { href: '/riwayat', label: 'Riwayat', showOnlyFor: 'siswa' }, // Hanya tampil untuk siswa
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-2xl shadow-xl border-b border-gray-200/50' 
            : 'bg-white/90 backdrop-blur-xl shadow-md'
        }`}
      >
        {/* Subtle animated background glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            opacity: isScrolled ? 0.2 : 0.4,
            background: `radial-gradient(circle 800px at ${mousePosition.x}px ${Math.max(mousePosition.y, 50)}px, rgba(37, 99, 235, 0.08), transparent 70%)`,
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section - Enhanced */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group relative z-10"
            >
              <div className="relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                {/* Logo container with gradient background */}
                <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-2.5 rounded-2xl border-2 border-blue-100/50 group-hover:border-blue-200 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1">
                  <Image
                    src="/starbhak_logoo.png"
                    alt="SMK Taruna Bhakti Logo"
                    width={isScrolled ? 38 : 44}
                    height={isScrolled ? 38 : 44}
                    className="rounded-lg transition-all duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-gray-900 transition-all duration-300 group-hover:text-blue-600 ${
                  isScrolled ? 'text-base' : 'text-lg'
                }`}>
                  Starbhak Konseling
                </span>
                <span className="text-xs text-gray-500 font-semibold tracking-wide">
                  SMK Taruna Bhakti Depok
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation - Enhanced */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => {
                // Skip link jika hanya untuk role tertentu dan user bukan role tersebut
                if (link.showOnlyFor && userRole !== link.showOnlyFor) {
                  return null;
                }
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group overflow-hidden ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    style={{
                      animation: `fadeInDown 0.5s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Active state background */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100/80 rounded-xl border-2 border-blue-200/50 shadow-sm"></div>
                    )}
                    
                    {/* Hover background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-100/0 rounded-xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:from-blue-50 group-hover:to-blue-100/60 transition-all duration-300"></div>
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl"></div>
                    
                    {/* Text */}
                    <span className="relative z-10 flex items-center justify-center">
                      {link.label}
                      {isActive && (
                        <span className="ml-2.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-sm shadow-blue-600/50"></span>
                      )}
                    </span>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-lg shadow-blue-600/30"></div>
                    )}
                    
                    {/* Hover underline animation */}
                    {!isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full group-hover:w-10 transition-all duration-300"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Login/Profile Button - Enhanced */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  {/* Notifikasi Bell untuk Siswa */}
                  {userRole === 'siswa' && (
                    <div className="relative hidden sm:block">
                      <button
                        onClick={() => {
                          setShowNotifikasi(!showNotifikasi);
                          if (!showNotifikasi && unreadCount > 0) {
                            markNotifikasiRead();
                          }
                        }}
                        className="relative p-2.5 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
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
                                const isDiterima = notif.tipe === 'konsultasi_diterima';
                                const isDitolak = notif.tipe === 'konsultasi_ditolak';
                                
                                return (
                                  <div
                                    key={notif.notifikasi_id}
                                    className={`p-5 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                                      !notif.is_read 
                                        ? isDiterima 
                                          ? 'bg-green-50 border-l-4 border-green-500' 
                                          : isDitolak 
                                            ? 'bg-red-50 border-l-4 border-red-500' 
                                            : 'bg-blue-50 border-l-4 border-blue-500'
                                        : 'bg-white'
                                    }`}
                                    onClick={() => {
                                      if (!notif.is_read) {
                                        markNotifikasiRead(notif.notifikasi_id);
                                      }
                                    }}
                                  >
                                    <div className="flex items-start space-x-4">
                                      {/* Icon berdasarkan tipe */}
                                      <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
                                        isDiterima 
                                          ? 'bg-green-100' 
                                          : isDitolak 
                                            ? 'bg-red-100' 
                                            : 'bg-blue-100'
                                      }`}>
                                        {isDiterima ? (
                                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        ) : isDitolak ? (
                                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        ) : (
                                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                          <p className={`text-base font-bold ${
                                            isDiterima 
                                              ? 'text-green-700' 
                                              : isDitolak 
                                                ? 'text-red-700' 
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
                                        
                                        {/* Detail Konsultasi jika ada */}
                                        {notif.konsultasi_id && (isDiterima || isDitolak) && (
                                          <div className={`mt-4 p-4 rounded-xl border-2 shadow-md ${
                                            isDiterima 
                                              ? 'bg-green-50 border-green-200' 
                                              : 'bg-red-50 border-red-200'
                                          }`}>
                                            {notif.konsultasi_judul && (
                                              <div className="flex items-start space-x-3 mb-3">
                                                <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-sm font-semibold text-gray-800">
                                                  <span className="font-bold">Topik:</span> {notif.konsultasi_judul}
                                                </p>
                                              </div>
                                            )}
                                            {notif.konsultasi_tanggal && notif.konsultasi_waktu && (
                                              <div className="flex items-start space-x-3 mb-3">
                                                <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-gray-700">
                                                  {new Date(notif.konsultasi_tanggal).toLocaleDateString('id-ID', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                  })} pukul {notif.konsultasi_waktu}
                                                </p>
                                              </div>
                                            )}
                                            {notif.nama_guru && (
                                              <div className="flex items-start space-x-3">
                                                <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <p className="text-sm text-gray-700">
                                                  <span className="font-bold">Guru:</span> {notif.nama_guru}
                                                </p>
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
                  )}
                  
                  <Link
                    href={userRole === 'guru' ? '/dashboard-guru' : '/profil-murid'}
                    className="hidden sm:flex items-center space-x-2.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 group relative overflow-hidden"
                  >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    {/* Icon */}
                    <svg className="w-5 h-5 relative z-10 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="relative z-10">{userRole === 'guru' ? 'Dashboard' : 'Profil'}</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center space-x-2.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 group relative overflow-hidden"
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  {/* Icon */}
                  <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative z-10">Masuk</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 relative z-10"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span 
                    className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span 
                    className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span 
                    className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-6 pt-3 space-y-2 bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-2xl border-t border-gray-200/50 shadow-inner">
            {navLinks.map((link, index) => {
              // Skip link jika hanya untuk role tertentu dan user bukan role tersebut
              if (link.showOnlyFor && userRole !== link.showOnlyFor) {
                return null;
              }
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-5 py-3.5 rounded-xl text-base font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-600 border-2 border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 active:scale-95'
                  }`}
                  style={{
                    animation: `fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.06}s both`,
                  }}
                >
                  <span className="flex-1">{link.label}</span>
                  {isActive && (
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-sm shadow-blue-600/50"></span>
                    </div>
                  )}
                  <svg 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive 
                        ? 'text-blue-600 transform translate-x-1' 
                        : 'text-gray-400 group-hover:text-blue-600'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
            
            {/* Mobile Login/Profile Button - Enhanced */}
            <div className="pt-4 border-t border-gray-200/50">
              {isLoggedIn ? (
                <Link
                  href={userRole === 'guru' ? '/dashboard-guru' : '/profil-murid'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2.5 w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-xl text-base font-bold shadow-xl shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="relative z-10">{userRole === 'guru' ? 'Dashboard' : 'Profil'}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2.5 w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-xl text-base font-bold shadow-xl shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative z-10">Masuk</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from going under navbar */}
      <div className={`transition-all duration-500 ${isScrolled ? 'h-20' : 'h-20'}`}></div>
    </>
  );
}
