'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LogoLoop from '@/components/LogoLoop';

export default function ProfilSekolahPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const aboutRef = useRef(null);
  const visionRef = useRef(null);
  const programRef = useRef(null);
  const facilityRef = useRef(null);
  const achievementRef = useRef(null);
  const statsRef = useRef(null);
  const historyRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const observers = [];
    const refs = [aboutRef, visionRef, programRef, facilityRef, achievementRef, statsRef, historyRef, contactRef];

    refs.forEach((ref) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const elements = entry.target.querySelectorAll('.animate-on-scroll');
                elements.forEach((el, index) => {
                  setTimeout(() => {
                    el.classList.add('animate-fadeInUp');
                  }, index * 100);
                });
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 md:py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div 
              className={`flex justify-center mb-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse-glow"></div>
                <div className="relative bg-white p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/starbhak_logoo.png"
                    alt="SMK Taruna Bhakti Logo"
                    width={180}
                    height={180}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              SMK Taruna Bhakti Depok
            </h1>
            <p 
              className={`text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              Sekolah Menengah Kejuruan yang berkomitmen menghasilkan lulusan berkarakter, berkompeten, dan siap menghadapi tantangan dunia kerja
            </p>
            <div 
              className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-semibold">NPSN: 20229232</span>
              </div>
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-semibold">Akreditasi: A</span>
              </div>
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-semibold">Berdiri: 2004</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* About Section */}
          <section ref={aboutRef} className="mb-20">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-12 bg-blue-600 rounded-full"></div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                  Tentang Sekolah
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="animate-on-scroll opacity-0">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                    SMK Taruna Bhakti adalah sekolah menengah kejuruan yang telah berdiri sejak tahun 2004.
                    Sekolah ini berlokasi di Jalan Raya Pekapuran RT 02 RW 07, Curug, Cimanggis, Depok, Jawa Barat.
                    Dengan <strong className="text-blue-600">Akreditasi A</strong> (Nomor: 02.00/230/BAP-SM/XII/2018), 
                    SMK Taruna Bhakti berkomitmen untuk menghasilkan lulusan yang kompeten dalam Ilmu Pengetahuan dan 
                    Teknologi (IPTEK) dan Iman Taqwa (IMTAQ) serta mampu bersaing pada tingkat nasional dan global.
                  </p>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                    Dengan fasilitas yang lengkap termasuk 10 laboratorium, Studio BRF, Data Center, dan tenaga pengajar 
                    yang berpengalaman, SMK Taruna Bhakti terus memberikan pendidikan yang berkualitas dan relevan dengan 
                    kebutuhan industri di bidang Teknologi Informasi dan Komunikasi.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-blue-900 font-semibold mb-1">Kepala Sekolah</p>
                    <p className="text-lg text-gray-900 font-bold">Aina Novera S.Pd, MM</p>
                  </div>
                </div>
                <div className="animate-on-scroll opacity-0">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 h-full">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Nilai-Nilai Sekolah</h3>
                    <div className="space-y-4">
                      {[
                        { 
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          ), 
                          title: 'Integritas', 
                          desc: 'Berpijak pada nilai-nilai kejujuran dan kebenaran',
                          color: '#2563eb'
                        },
                        { 
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          ), 
                          title: 'Inovasi', 
                          desc: 'Selalu mengembangkan metode pembelajaran terbaik',
                          color: '#1e40af'
                        },
                        { 
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          ), 
                          title: 'Kolaborasi', 
                          desc: 'Bekerja sama untuk mencapai tujuan bersama',
                          color: '#3b82f6'
                        },
                        { 
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ), 
                          title: 'Excellence', 
                          desc: 'Berusaha mencapai standar tertinggi dalam semua aspek',
                          color: '#60a5fa'
                        },
                      ].map((value, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: value.color + '20', color: value.color }}
                          >
                            {value.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{value.title}</h4>
                            <p className="text-gray-600 text-sm">{value.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision Mission */}
          <section ref={visionRef} className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visi */}
              <div className="animate-on-scroll opacity-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-2xl p-8 md:p-10 text-white transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black">Visi</h2>
                </div>
                <p className="text-lg md:text-xl leading-relaxed text-blue-50">
                  Menghasilkan Lulusan Yang Kompeten Dalam Ilmu Pengetahuan dan Teknologi (IPTEK) dan Iman Taqwa (IMTAQ) 
                  Serta Mampu Bersaing Pada Tingkat Nasional dan Global
                </p>
              </div>

              {/* Misi */}
              <div className="animate-on-scroll opacity-0 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-blue-200 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900">Misi</h2>
                </div>
                <ul className="space-y-4">
                  {[
                    'Menumbuhkan Semangat Kreatifitas, Bersinergi Dan Kompetitif Kepada Seluruh Warga Sekolah',
                    'Melaksanakan Kurikulum Melalui Pembelajaran Dan Penilaian Berbasis Kompetensi, Berbasis Wirausaha Berwawasan Lingkungan',
                    'Meningkatkan kualitas sumber daya manusia melalui sertifikasi Kompetensi Tingkat Nasional dan Internasional',
                    'Mengembangkan Potensi Peserta Didik Melalui Kegiatan Minat Dan Bakat Dan Pembinaan Kedisiplinan',
                    'Menerapkan Layanan Prima Dalam Pengelolaan Sekolah Melalui Sistem Manajemen Mutu',
                  ].map((mission, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg leading-relaxed">{mission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section ref={statsRef} className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  number: '1.664', 
                  label: 'Siswa', 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ), 
                  color: '#2563eb' 
                },
                { 
                  number: '73', 
                  label: 'Tenaga Pendidik', 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ), 
                  color: '#1e40af' 
                },
                { 
                  number: '43', 
                  label: 'Rombongan Belajar', 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v5" />
                    </svg>
                  ), 
                  color: '#3b82f6' 
                },
                { 
                  number: '10+', 
                  label: 'Laboratorium', 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ), 
                  color: '#60a5fa' 
                },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="animate-on-scroll opacity-0 bg-white rounded-2xl p-6 shadow-xl border-l-4 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  style={{ borderLeftColor: stat.color }}
                >
                  <div 
                    className="mb-4"
                    style={{ color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Programs */}
          <section ref={programRef} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Program Keahlian
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Program keahlian yang dirancang untuk mempersiapkan siswa menghadapi dunia kerja
              </p>
              
              {/* Logo Loop untuk Jurusan */}
              <div className="mb-12">
                <LogoLoop
                  logos={[
                    { src: '/logo_jurusan/remove_pplg.png', alt: 'PPLG - Pengembangan Perangkat Lunak dan Game', title: 'PPLG' },
                    { src: '/logo_jurusan/remove_tkj.png', alt: 'TJKT - Teknik Jaringan Komputer dan Telekomunikasi', title: 'TJKT' },
                    { src: '/logo_jurusan/remove_animasi.png', alt: 'Animasi', title: 'Animasi' },
                    { src: '/logo_jurusan/remove_bc.png', alt: 'BRF - Broadcasting dan Perfilman', title: 'BRF' },
                    { src: '/logo_jurusan/remove_te.png', alt: 'TE - Teknik Elektronika', title: 'TE' },
                    { src: '/logo_jurusan/remove_dkv.png', alt: 'DKV - Desain Komunikasi Visual', title: 'DKV' },
                  ]}
                  speed={80}
                  direction="left"
                  logoHeight={80}
                  gap={60}
                  pauseOnHover
                  scaleOnHover
                  fadeOut
                  fadeOutColor="#ffffff"
                  ariaLabel="Program Keahlian"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  title: 'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
                  shortDescription: 'Program keahlian yang fokus pada perancangan, instalasi, konfigurasi, dan maintenance jaringan komputer dan telekomunikasi.',
                  fullDescription: 'Program keahlian TJKT mempersiapkan siswa untuk menguasai teknologi jaringan komputer dan telekomunikasi. Siswa akan belajar tentang perancangan, instalasi, konfigurasi, troubleshooting, dan maintenance jaringan komputer. Program ini mencakup pembelajaran tentang network security, cloud computing, wireless network, dan sistem komunikasi data.',
                  logo: '/logo_jurusan/remove_tkj.png',
                  color: '#2563eb',
                  skills: ['Network Installation', 'Network Configuration', 'Troubleshooting', 'Network Security', 'Cloud Computing', 'Wireless Network'],
                  career: ['Network Administrator', 'Network Engineer', 'System Administrator', 'IT Support Specialist', 'Network Security Specialist'],
                  duration: '3 Tahun',
                  competencies: ['Merancang dan mengimplementasikan jaringan komputer', 'Mengelola dan memelihara infrastruktur jaringan', 'Mengamankan sistem jaringan dari ancaman', 'Troubleshooting masalah jaringan'],
                },
                {
                  id: 2,
                  title: 'Animasi (Anim)',
                  shortDescription: 'Program keahlian yang mempelajari pembuatan animasi 2D dan 3D, motion graphics, dan visual effects.',
                  fullDescription: 'Program keahlian Animasi mempersiapkan siswa untuk menjadi animator profesional. Siswa akan belajar membuat animasi 2D dan 3D, motion graphics, visual effects, dan karakter design. Program ini mencakup pembelajaran tentang storyboarding, rigging, lighting, rendering, dan compositing. Siswa akan menggunakan software seperti Adobe After Effects, Blender, Maya, dan lainnya.',
                  logo: '/logo_jurusan/remove_animasi.png',
                  color: '#1e40af',
                  skills: ['2D Animation', '3D Animation', 'Motion Graphics', 'Visual Effects', 'Character Design', 'Storyboarding'],
                  career: ['2D/3D Animator', 'Motion Graphics Designer', 'VFX Artist', 'Character Designer', 'Storyboard Artist'],
                  duration: '3 Tahun',
                  competencies: ['Membuat animasi 2D dan 3D profesional', 'Menggunakan software animasi terkini', 'Mengembangkan karakter dan storyboard', 'Membuat visual effects dan motion graphics'],
                },
                {
                  id: 3,
                  title: 'Pengembangan Perangkat Lunak dan Game (PPLG)',
                  shortDescription: 'Program keahlian yang fokus pada pengembangan aplikasi software, website, dan game development.',
                  fullDescription: 'Program keahlian PPLG mempersiapkan siswa untuk menjadi developer profesional. Siswa akan belajar pemrograman, pengembangan aplikasi mobile dan web, game development, database management, dan software engineering. Program ini mencakup pembelajaran tentang berbagai bahasa pemrograman seperti JavaScript, Python, Java, dan framework modern seperti React, Node.js, dan lainnya.',
                  logo: '/logo_jurusan/remove_pplg.png',
                  color: '#3b82f6',
                  skills: ['Programming', 'Web Development', 'Game Development', 'Database', 'Mobile Development', 'Software Engineering'],
                  career: ['Software Developer', 'Web Developer', 'Game Developer', 'Mobile App Developer', 'Full Stack Developer'],
                  duration: '3 Tahun',
                  competencies: ['Mengembangkan aplikasi web dan mobile', 'Membuat game dengan engine modern', 'Mengelola database dan sistem informasi', 'Menerapkan software engineering principles'],
                },
                {
                  id: 4,
                  title: 'Broadcasting dan Perfilman (BRF)',
                  shortDescription: 'Program keahlian yang mempelajari produksi konten broadcast, film, video, dan multimedia.',
                  fullDescription: 'Program keahlian BRF mempersiapkan siswa untuk bekerja di industri broadcasting dan perfilman. Siswa akan belajar produksi video, editing, cinematography, sound design, dan broadcasting. Program ini mencakup pembelajaran tentang script writing, directing, camera operation, video editing, audio production, dan live streaming. Siswa akan menggunakan peralatan profesional dan software editing seperti Adobe Premiere Pro, Final Cut Pro, dan lainnya.',
                  logo: '/logo_jurusan/remove_bc.png',
                  color: '#60a5fa',
                  skills: ['Video Production', 'Broadcasting', 'Film Making', 'Editing', 'Cinematography', 'Sound Design'],
                  career: ['Video Producer', 'Film Director', 'Video Editor', 'Cinematographer', 'Broadcasting Technician'],
                  duration: '3 Tahun',
                  competencies: ['Memproduksi konten video profesional', 'Mengoperasikan peralatan broadcasting', 'Mengedit video dengan software profesional', 'Membuat konten multimedia'],
                },
                {
                  id: 5,
                  title: 'Teknik Elektronika (TE)',
                  shortDescription: 'Program keahlian yang mempelajari perancangan, instalasi, dan perawatan peralatan elektronika.',
                  fullDescription: 'Program keahlian TE mempersiapkan siswa untuk menguasai teknologi elektronika. Siswa akan belajar tentang perancangan sirkuit elektronika, instalasi dan perawatan peralatan elektronika, microcontroller programming, dan sistem kontrol. Program ini mencakup pembelajaran tentang komponen elektronika, PCB design, troubleshooting, dan repair & maintenance. Siswa akan menggunakan tools seperti Arduino, Raspberry Pi, dan software desain PCB.',
                  logo: '/logo_jurusan/remove_te.png',
                  color: '#93c5fd',
                  skills: ['Electronics Design', 'Circuit Analysis', 'Repair & Maintenance', 'Testing', 'Microcontroller Programming', 'PCB Design'],
                  career: ['Electronics Engineer', 'Electronics Technician', 'PCB Designer', 'Automation Engineer', 'Service Technician'],
                  duration: '3 Tahun',
                  competencies: ['Merancang sirkuit elektronika', 'Menginstal dan memelihara peralatan elektronika', 'Memprogram microcontroller', 'Membuat dan mendesain PCB'],
                },
                {
                  id: 6,
                  title: 'Desain Komunikasi Visual (DKV)',
                  shortDescription: 'Program keahlian yang mempelajari desain grafis, branding, ilustrasi, dan komunikasi visual.',
                  fullDescription: 'Program keahlian DKV mempersiapkan siswa untuk menjadi desainer grafis profesional. Siswa akan belajar tentang desain grafis, branding, ilustrasi, typography, layout design, dan komunikasi visual. Program ini mencakup pembelajaran tentang design thinking, color theory, visual identity, packaging design, dan digital design. Siswa akan menggunakan software seperti Adobe Photoshop, Illustrator, InDesign, dan Figma.',
                  logo: '/logo_jurusan/remove_dkv.png',
                  color: '#a78bfa',
                  skills: ['Graphic Design', 'Branding', 'Illustration', 'Typography', 'Layout Design', 'Digital Design'],
                  career: ['Graphic Designer', 'Brand Designer', 'Illustrator', 'UI/UX Designer', 'Creative Director'],
                  duration: '3 Tahun',
                  competencies: ['Membuat desain grafis profesional', 'Mengembangkan identitas visual dan branding', 'Membuat ilustrasi dan artwork', 'Mendesain layout dan komunikasi visual'],
                },
              ].map((program) => (
                <div
                  key={program.id}
                  onClick={() => {
                    setSelectedProgram(program);
                    setIsDetailOpen(true);
                  }}
                  className="animate-on-scroll opacity-0 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                  {/* Logo Jurusan */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <Image
                        src={program.logo}
                        alt={program.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 bg-gray-50 p-2"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{program.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{program.shortDescription}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {program.skills.slice(0, 4).map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="px-3 py-1 text-xs font-semibold rounded-full"
                        style={{ 
                          backgroundColor: program.color + '15',
                          color: program.color,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <span className="text-sm text-gray-500 inline-flex items-center">
                      Klik untuk detail lebih lengkap
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Facilities */}
          <section ref={facilityRef} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Fasilitas Sekolah
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Fasilitas lengkap untuk mendukung proses pembelajaran yang optimal
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  name: 'Perpustakaan', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  desc: 'Koleksi lengkap buku dan referensi',
                },
                { 
                  name: 'Lab Komputer', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  desc: 'Laboratorium komputer modern',
                },
                { 
                  name: 'Gedung Modern', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ),
                  desc: 'Gedung nyaman dan modern',
                },
                { 
                  name: 'Lab Praktik', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                  desc: 'Laboratorium praktik lengkap',
                },
                { 
                  name: 'Lapangan Olahraga', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  ),
                  desc: 'Fasilitas olahraga lengkap',
                },
                { 
                  name: 'Mushola', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  desc: 'Tempat ibadah yang nyaman',
                },
                { 
                  name: 'Kantin', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  desc: 'Kantin sehat dan bersih',
                },
                { 
                  name: 'WiFi Area', 
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  ),
                  desc: 'Internet cepat di seluruh area',
                },
              ].map((facility, idx) => (
                <div
                  key={idx}
                  className="animate-on-scroll opacity-0 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center group"
                >
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}
                  >
                    {facility.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{facility.name}</h3>
                  <p className="text-sm text-gray-600">{facility.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* History/Timeline Section */}
          <section ref={historyRef} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Sejarah Sekolah
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Perjalanan panjang menuju keunggulan dalam dunia pendidikan
              </p>
            </div>
            <div className="relative">
              {/* Timeline Line - Mobile: Left, Desktop: Center */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-400"></div>
              
              <div className="space-y-12 pl-12 md:pl-0">
                {[
                  {
                    year: '2004',
                    title: 'Pendirian Sekolah',
                    description: 'SMK Taruna Bhakti didirikan dengan fokus pada bidang Teknologi Informasi dan Komunikasi untuk menghasilkan lulusan yang kompeten.',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ),
                  },
                  {
                    year: '2010',
                    title: 'Ekspansi Program',
                    description: 'Pengembangan program keahlian baru dan peningkatan fasilitas laboratorium untuk mendukung pembelajaran yang lebih baik.',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                  },
                  {
                    year: '2018',
                    title: 'Akreditasi A',
                    description: 'Mendapatkan akreditasi A (Nomor: 02.00/230/BAP-SM/XII/2018) dari Badan Akreditasi Nasional, mengukuhkan kualitas pendidikan di sekolah ini.',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    ),
                  },
                  {
                    year: '2020',
                    title: 'Pengembangan Fasilitas',
                    description: 'Pembangunan Studio BRF dan Data Center untuk mendukung program keahlian Broadcasting dan Perfilman serta infrastruktur IT.',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    ),
                  },
                  {
                    year: '2023',
                    title: 'Prestasi Nasional',
                    description: 'Meraih Juara 1 LKS Nasional di bidang Teknik Informatika, membuktikan kualitas lulusan sekolah dalam kompetensi teknologi informasi.',
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    ),
                  },
                ].map((milestone, idx) => (
                  <div
                    key={idx}
                    className="animate-on-scroll opacity-0 relative"
                  >
                    {/* Timeline Dot - Absolute positioned */}
                    <div 
                      className="absolute -left-[3.25rem] md:left-1/2 md:-translate-x-1/2 top-0 w-16 h-16 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10"
                      style={{ backgroundColor: '#2563eb' }}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Content Card */}
                    <div className="md:flex md:items-center md:gap-8">
                      {/* Left content (even) or right content (odd) on desktop */}
                      <div className={`flex-1 md:w-1/2 ${
                        idx % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto md:order-2'
                      }`}>
                        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-200 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                          <div className={`flex items-center gap-3 mb-4 ${
                            idx % 2 === 0 ? 'justify-start md:justify-end md:flex-row-reverse' : 'justify-start'
                          }`}>
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: '#2563eb20', color: '#2563eb' }}
                            >
                              {milestone.icon}
                            </div>
                            <div className="text-2xl font-black text-blue-600">{milestone.year}</div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      
                      {/* Spacer for desktop */}
                      <div className={`hidden md:block flex-1 md:w-1/2 ${idx % 2 === 0 ? 'order-2' : 'order-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Achievement Section */}
          <section ref={achievementRef} className="mb-20">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-4">Prestasi & Pencapaian</h2>
                  <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Bukti komitmen kami dalam memberikan pendidikan terbaik
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      title: 'Juara 1 LKS Nasional', 
                      year: '2023', 
                      desc: 'Teknik Informatika', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      )
                    },
                    { 
                      title: 'Sekolah Adiwiyata', 
                      year: '2022', 
                      desc: 'Penghargaan Lingkungan', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    },
                    { 
                      title: 'Akreditasi A', 
                      year: '2021', 
                      desc: 'Terakreditasi Unggul', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )
                    },
                    { 
                      title: 'Juara 2 LKS Provinsi', 
                      year: '2023', 
                      desc: 'Teknik Mesin', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    },
                    { 
                      title: 'Sekolah Sehat', 
                      year: '2022', 
                      desc: 'Penghargaan Kesehatan', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )
                    },
                    { 
                      title: 'Best Practice', 
                      year: '2021', 
                      desc: 'Inovasi Pembelajaran', 
                      icon: (
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )
                    },
                  ].map((achievement, idx) => (
                    <div
                      key={idx}
                      className="animate-on-scroll opacity-0 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="text-white mb-3">{achievement.icon}</div>
                      <div className="text-2xl font-bold mb-2">{achievement.year}</div>
                      <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                      <p className="text-blue-100">{achievement.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section ref={contactRef} className="mb-20">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-blue-200 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    Kontak Sekolah
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Hubungi kami untuk informasi lebih lanjut
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {[
                    {
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      title: 'Alamat',
                      content: 'Jalan Raya Pekapuran RT 02 RW 07\nCurug, Cimanggis, Depok\nJawa Barat 16953',
                      color: '#2563eb',
                    },
                    {
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      title: 'Telepon',
                      content: '(021) 8744810\nFax: (021) 87743374',
                      color: '#1e40af',
                    },
                    {
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      title: 'Email & Website',
                      content: 'taruna@smktarunabhakti.net\nwww.smktarunabhakti.sch.id',
                      color: '#3b82f6',
                    },
                  ].map((contact, idx) => (
                    <div
                      key={idx}
                      className="animate-on-scroll opacity-0 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center group"
                    >
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: contact.color + '20', color: contact.color }}
                      >
                        {contact.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{contact.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{contact.content}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Link
                    href="/peta"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Lihat Lokasi di Peta
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedProgram && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setIsDetailOpen(false)}
          style={{
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/90 backdrop-blur-xl"
            style={{
              animation: 'fadeIn 0.4s ease-out',
            }}
          />
          
          {/* Modal Content */}
          <div className="flex min-h-screen items-center justify-center p-6 lg:p-8">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out mx-4"
              style={{
                animation: 'modalEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.18)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <div 
                className="relative p-8 rounded-t-3xl"
                style={{ 
                  background: `linear-gradient(135deg, ${selectedProgram.color}12 0%, ${selectedProgram.color}05 100%)`,
                }}
              >
                <div 
                  className="flex items-center gap-6 mb-6"
                  style={{
                    animation: 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
                  }}
                >
                  <div 
                    className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl transition-transform duration-300 hover:scale-105"
                    style={{
                      animation: 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
                    }}
                  >
                    <Image
                      src={selectedProgram.logo}
                      alt={selectedProgram.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain bg-white p-3"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedProgram.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedProgram.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8">
                {/* Description */}
                <div
                  style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
                  }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full" style={{ backgroundColor: selectedProgram.color }} />
                    Deskripsi Program
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProgram.fullDescription}</p>
                </div>

                {/* Skills */}
                <div
                  style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
                  }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full" style={{ backgroundColor: selectedProgram.color }} />
                    Kompetensi yang Dipelajari
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedProgram.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-300 hover:scale-[1.01]"
                        style={{
                          animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.5 + idx * 0.05}s both`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: selectedProgram.color }}
                        />
                        <span className="text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competencies */}
                <div
                  style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
                  }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full" style={{ backgroundColor: selectedProgram.color }} />
                    Kemampuan Lulusan
                  </h3>
                  <ul className="space-y-3">
                    {selectedProgram.competencies.map((competency, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-lg border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-300 hover:scale-[1.005]"
                        style={{
                          animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.7 + idx * 0.07}s both`,
                          borderLeftColor: selectedProgram.color,
                          borderLeftWidth: '4px',
                        }}
                      >
                        <svg
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: selectedProgram.color }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{competency}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Opportunities */}
                <div
                  style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both',
                  }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full" style={{ backgroundColor: selectedProgram.color }} />
                    Peluang Karir
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProgram.career.map((job, idx) => (
                      <span
                        key={idx}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-default"
                        style={{
                          backgroundColor: selectedProgram.color + '20',
                          color: selectedProgram.color,
                          animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.9 + idx * 0.04}s both`,
                        }}
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div 
                className="p-8 border-t border-gray-200/50 bg-gray-50/20 rounded-b-3xl"
                style={{
                  animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s both',
                }}
              >
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
                  style={{ 
                    backgroundColor: selectedProgram.color,
                    boxShadow: `0 4px 14px 0 ${selectedProgram.color}30`,
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

