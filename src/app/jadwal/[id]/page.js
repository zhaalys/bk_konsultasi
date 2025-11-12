'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const teachers = {
  1: {
    name: 'Heni Siswati, S.Psi',
    title: 'KOORDINATOR BK',
    specialization: 'Bimbingan Pribadi & Sosial',
    image: '/guru_bk/HeniSiswati,S.Psi.jpg',
  },
  2: {
    name: 'Kasandra Fitriani. N, S.Pd',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Karir',
    image: '/guru_bk/KasandraFitriani.N,S.Pd.png',
  },
  3: {
    name: 'Nadya Afriliani Ariesta, S.Pd',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Akademik',
    image: '/guru_bk/NadyaAfrilianiAriesta,S.Pd.png',
  },
  4: {
    name: 'Ika Rafika, S.Pd',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Pribadi',
    image: '/guru_bk/IkaRafika,S.Pd.png',
  },
  5: {
    name: 'Ricky M Sudra',
    title: 'Guru Bimbingan dan Konseling',
    specialization: 'Bimbingan Karir & Akademik',
    image: '/guru_bk/Ricky_M_Sudra.png',
  },
};

// Available time slots (Senin - Jumat, 08:00 - 15:00)
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00'
];

const consultationTopics = [
  'Bimbingan Pribadi',
  'Bimbingan Sosial',
  'Bimbingan Akademik',
  'Bimbingan Karir',
  'Masalah Keluarga',
  'Masalah Pertemanan',
  'Stress & Kecemasan',
  'Masalah Lainnya',
];

export default function JadwalPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = parseInt(params.id);
  const teacher = teachers[teacherId];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    // Load booked slots from localStorage
    const bookingsKey = `bookings_${teacherId}`;
    const savedBookings = localStorage.getItem(bookingsKey);
    if (savedBookings) {
      const bookings = JSON.parse(savedBookings);
      setBookedSlots(bookings);
    }

    // Set minimum date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, [teacherId, router]);

  // Get available time slots (exclude booked ones for selected date)
  const getAvailableSlots = () => {
    if (!selectedDate) return timeSlots;
    
    const bookedForDate = bookedSlots
      .filter(booking => booking.date === selectedDate && booking.status !== 'cancelled')
      .map(booking => booking.time);
    
    return timeSlots.filter(slot => !bookedForDate.includes(slot));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedTopic) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user info
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.user_id) {
        alert('Silakan login terlebih dahulu');
        router.push('/login');
        return;
      }

      // Ambil guru_id dari database berdasarkan email
      // Mapping teacherId ke email guru (sesuai dengan email yang digunakan saat registrasi)
      // Pastikan email guru menggunakan domain @bk.sch.id
      const teacherEmailMap = {
        1: 'heni.siswati@bk.sch.id', // Heni Siswati - pastikan email ini terdaftar di database
        2: 'kasandra.fitriani@bk.sch.id', // Kasandra Fitriani
        3: 'nadya.afriliani@bk.sch.id', // Nadya Afriliani
        4: 'ika.rafika@bk.sch.id', // Ika Rafika
        5: 'ricky.sudra@bk.sch.id', // Ricky M Sudra
      };
      
      // Atau bisa juga menggunakan nama untuk mencari (jika email tidak match)
      const teacherNameMap = {
        1: 'Heni Siswati', // atau 'Heni Siswati, S.Psi'
        2: 'Kasandra Fitriani',
        3: 'Nadya Afriliani',
        4: 'Ika Rafika',
        5: 'Ricky M Sudra',
      };
      
      const teacherEmail = teacherEmailMap[teacherId];
      
      // Ambil guru_id dari database - WAJIB dapat user_id yang benar!
      let guru_id = null;
      
      if (teacherEmail) {
        try {
          const guruRes = await fetch(`/api/users?email=${encodeURIComponent(teacherEmail)}`);
          if (guruRes.ok) {
            const guruData = await guruRes.json();
            if (guruData.success && guruData.data.length > 0) {
              guru_id = guruData.data[0].user_id;
            }
          }
        } catch (error) {
          console.error('Get guru_id error:', error);
        }
      }
      
      // Jika email tidak ditemukan, coba cari berdasarkan nama
      if (!guru_id && teacherNameMap[teacherId]) {
        try {
          const guruRes = await fetch(`/api/users?role=guru`);
          if (guruRes.ok) {
            const guruData = await guruRes.json();
            if (guruData.success && guruData.data.length > 0) {
              const guru = guruData.data.find(g => 
                g.nama_lengkap.toLowerCase().includes(teacherNameMap[teacherId].toLowerCase().split(',')[0].trim())
              );
              if (guru) {
                guru_id = guru.user_id;
              }
            }
          }
        } catch (error) {
          console.error('Get guru_id by name error:', error);
        }
      }
      
      // JIKA TIDAK DITEMUKAN, TAMPILKAN ERROR - JANGAN LANJUTKAN!
      if (!guru_id) {
        alert(`Guru tidak ditemukan di database. Pastikan guru dengan email ${teacherEmail || 'yang sesuai'} sudah terdaftar.`);
        setIsSubmitting(false);
        return;
      }

      // Submit konsultasi ke API
      const response = await fetch('/api/konsultasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siswa_id: user.user_id,
          guru_id: guru_id,
          judul: selectedTopic,
          deskripsi: description || `Konsultasi mengenai ${selectedTopic}`,
          tanggal: selectedDate,
          waktu: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Gagal mengajukan konsultasi');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form
      setTimeout(() => {
        setSelectedTime('');
        setSelectedTopic('');
        setDescription('');
        setIsSuccess(false);
        router.push('/riwayat');
      }, 2000);
    } catch (error) {
      console.error('Submit konsultasi error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if date is in the past
  const isDatePast = (dateString) => {
    if (!dateString) return false;
    const selected = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected < today;
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Guru BK tidak ditemukan</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/guru-bk"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Daftar Guru BK
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Jadwalkan Konsultasi
            </h1>
            <p className="text-xl text-gray-600">
              Buat janji konsultasi tatap muka dengan guru BK
            </p>
          </div>

          {/* Teacher Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {teacher.name}
                </h2>
                <p className="text-blue-600 font-semibold mb-1">
                  {teacher.title}
                </p>
                <p className="text-gray-600">
                  {teacher.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Booking Berhasil!
                </h3>
                <p className="text-gray-600">
                  Jadwal konsultasi Anda telah dibuat. Mengalihkan ke halaman riwayat...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Pilih Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {selectedDate && (
                    <p className="mt-2 text-sm text-gray-600">
                      {formatDate(selectedDate)}
                    </p>
                  )}
                  {selectedDate && isDatePast(selectedDate) && (
                    <p className="mt-2 text-sm text-red-600">
                      Tanggal yang dipilih sudah berlalu
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Pilih Waktu <span className="text-red-500">*</span>
                  </label>
                  {!selectedDate ? (
                    <p className="text-sm text-gray-500">Pilih tanggal terlebih dahulu</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {getAvailableSlots().map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedTime === time
                              ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedDate && getAvailableSlots().length === 0 && (
                    <p className="mt-2 text-sm text-yellow-600">
                      Tidak ada slot waktu tersedia pada tanggal ini. Silakan pilih tanggal lain.
                    </p>
                  )}
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Topik Konsultasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih topik konsultasi</option>
                    {consultationTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Deskripsi Masalah (Opsional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jelaskan secara singkat masalah atau topik yang ingin dikonsultasikan..."
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Informasi Penting:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>Konsultasi dilakukan secara tatap muka di ruang BK</li>
                        <li>Datang tepat waktu sesuai jadwal yang dipilih</li>
                        <li>Bawa kartu siswa atau identitas lainnya</li>
                        <li>Jadwal dapat diubah atau dibatalkan maksimal 1 hari sebelumnya</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <Link
                    href="/guru-bk"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center font-medium"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDate || !selectedTime || !selectedTopic}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Memproses...' : 'Buat Janji Konsultasi'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

